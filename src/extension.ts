'use strict';
import * as vscode from 'vscode';
import * as azdata from 'azdata';
import {placeScript} from './placescript';
import {changeDatabase} from './changeDatabase';
import {settingsUpdates} from './settingsUpdates';
import * as connectHolder from './connectHolder';

import Snippet from "./vscode-snippet-creator/Snippet";
import SnippetsManager from "./vscode-snippet-creator/SnippetsManager";

export function activate(context: vscode.ExtensionContext) {
    // setup the dashboard task buttons
    new settingsUpdates().initQEB();
    
    var setupQEB = async () => {
        await new settingsUpdates().initQEB();
    }

    //dsk.createQueryTemplate
    var createQueryTemplate = async () => {
        const editor = vscode.window.activeTextEditor;
        let cursorPosition = editor.selection.start;
        let lineCount = editor.document.lineCount;
        let templateBuilder:string[] = [];

        for (let i = 0; i < lineCount; i++) {
            templateBuilder.push(editor.document.lineAt(i).text);
        }
        
        var theSettings = vscode.workspace.getConfiguration();
        theSettings.update('newquerytemplate.DefaultQueryTemplate',templateBuilder,vscode.ConfigurationTarget.Global);
        theSettings.update('newquerytemplate.DefaultQueryLine', cursorPosition.line, vscode.ConfigurationTarget.Global);
        theSettings.update('newquerytemplate.DefaultQueryCharacter', cursorPosition.character, vscode.ConfigurationTarget.Global);
    }
    var disposable_createQueryTemplate = vscode.commands.registerCommand('dsk.createQueryTemplate', createQueryTemplate);
    context.subscriptions.push(disposable_createQueryTemplate);

    //dsk.newqueryoption
    var newQueryOption = async (profile?: azdata.IConnectionProfile, context?: azdata.ObjectExplorerContext) => {
        let scriptText:string = "";
        const workbenchConfig = vscode.workspace.getConfiguration('newquerytemplate');
        let queryTemplateArray = new Array<String>();
        queryTemplateArray = workbenchConfig.get('DefaultQueryTemplate');
        if (queryTemplateArray.length >= 1) {
            queryTemplateArray.forEach(function(scriptLine) {
                scriptText += scriptLine;
                scriptText += `
`;
            });
        }
        new placeScript().placescript(scriptText, profile, context);
    };
    vscode.commands.registerCommand('dsk.newqueryoption', newQueryOption);
    azdata.tasks.registerTask('dsk.newqueryoption', (profile?: azdata.IConnectionProfile, context?: azdata.ObjectExplorerContext) => newQueryOption(profile, context));
    
    //dsk.resetDashboards
    var useDatabaseCmd = () => {
        azdata.connection.getCurrentConnection().then( connection =>  {
            if (connection) {
                let databaseList = azdata.connection.listDatabases(connection.connectionId);
                new changeDatabase().changeDatabase(databaseList, connection);
            } else {
                vscode.window.showErrorMessage("No connection found.  Connect before switching databases.");
            }
        }, error => {
            console.info(error);
        });
    }
    var disposable_useDatabase = vscode.commands.registerCommand('dsk.useDatabase', useDatabaseCmd);
    context.subscriptions.push(disposable_useDatabase);

    var resetDashboards = async () => {
        await new settingsUpdates().uninstallQEB();
        
    }
    var disposable_resetDashboards = vscode.commands.registerCommand('dsk.resetDashboards', resetDashboards);
    context.subscriptions.push(disposable_resetDashboards);

    //dsk.addSnippetPlaceholder
    var addSnippetPlaceholder = async () => {
        let newPlaceholder = await vscode.window.showInputBox({placeHolder: 'Placeholder Name'});
        let editor = vscode.window.activeTextEditor;
        let placeholderIndex = 0;
        let testIndex = 1;
        
        let currentQuery:string = editor.document.getText();
        while (placeholderIndex == 0) {
            if ( currentQuery.includes(':'+newPlaceholder+'}') ) {
                let probableindex:string = currentQuery.substr(currentQuery.indexOf(':'+newPlaceholder+'}')-2,2);
                if (probableindex[0] == '{') {
                    placeholderIndex = parseInt(probableindex[1]);
                } else {
                    placeholderIndex = parseInt(probableindex);
                }
            } else {
                if (!(currentQuery.includes('${'+testIndex.toString()) ) ) {
                    placeholderIndex = testIndex;
                }
            }
            testIndex++;
        }

        let placeholderSyntax = '${'+placeholderIndex.toString()+':'+ newPlaceholder + '}';
        let cursorLoc:vscode.Position = editor.selection.start;

        editor.edit(edit => {
            edit.insert(cursorLoc, placeholderSyntax);
        });
        
    }
    var disposable_addSnippetPlaceholder = vscode.commands.registerCommand('dsk.addSnippetPlaceholder', addSnippetPlaceholder);
    context.subscriptions.push(disposable_addSnippetPlaceholder);

    //dsk.addSnippetVariable
    var addSnippetVariable = async () => {
        let variableList:vscode.QuickPickItem[] = [
            {label:"CURRENT_YEAR", description: "The current year"},
            {label:"CURRENT_YEAR_SHORT", description: "The current year's last two digits"},
            {label:"CURRENT_MONTH", description: "The month as two digits (example '02')"},
            {label:"CURRENT_MONTH_NAME", description: "The full name of the month (example 'July')"},
            {label:"CURRENT_MONTH_NAME_SHORT", description: "The short name of the month (example 'Jul')"},
            {label:"CURRENT_DATE", description: "The day of the month"},
            {label:"CURRENT_DAY_NAME", description: "The name of day (example 'Monday')"},
            {label:"CURRENT_DAY_NAME_SHORT", description: "The short name of the day (example 'Mon')"},
            {label:"CURRENT_HOUR", description: "The current hour in 24-hour clock format"},
            {label:"CURRENT_MINUTE", description: "The current minute"},
            {label:"CURRENT_SECOND", description: "The current second"},
            {label:"TM_SELECTED_TEXT", description: "The currently selected text or the empty string"},
            {label:"TM_CURRENT_LINE", description: "The contents of the current line"},
            {label:"TM_CURRENT_WORD", description: "The contents of the word under cursor or the empty string"},
            {label:"TM_LINE_INDEX", description: "The zero-index based line number"},
            {label:"TM_LINE_NUMBER", description: "The one-index based line number"},
            {label:"TM_FILENAME", description: "The filename of the current document"},
            {label:"TM_FILENAME_BASE", description: "The filename of the current document without its extensions"},
            {label:"TM_DIRECTORY", description: "The directory of the current document"},
            {label:"TM_FILEPATH", description: "The full file path of the current document"},
            {label:"CLIPBOARD", description: "The contents of your clipboard"},
            {label:"WORKSPACE_NAME", description: "The name of the opened workspace or folder"},
        ];
        let newVariable = await vscode.window.showQuickPick(variableList, 
            { placeHolder: 'Snippet Variables', ignoreFocusOut: true}
        );
        let editor = vscode.window.activeTextEditor;
        let placeholderSyntax = '$'+ newVariable.label;
        let cursorLoc:vscode.Position = editor.selection.start;
        editor.edit(edit => {
            edit.insert(cursorLoc, placeholderSyntax);
        });
        
    }
    var disposable_addSnippetVariable = vscode.commands.registerCommand('dsk.addSnippetVariable', addSnippetVariable);
    context.subscriptions.push(disposable_addSnippetVariable);

    
    //dsk.saveNewSnippet
    var saveNewSnippet = async () => {
        try {
			const editor = vscode.window.activeTextEditor;
			if (editor === undefined) { return; }

            let snippetText = editor.document.getText();

			var snippet = new Snippet();
			var snippetsManager = new SnippetsManager();

			if (!(snippetText.length > 0)) {
				vscode.window.showWarningMessage('Cannot create snippet from empty string. Select some text first.');
				return;
			}
            snippet.language = editor.document.languageId;

			const name = await vscode.window.showInputBox({ prompt: 'Enter snippet name' });
			if (name === undefined) { return; }
			snippet.name = name;

			const prefix = await vscode.window.showInputBox({ prompt: 'Enter snippet prefix' });
			if (prefix === undefined) { return; }
			snippet.prefix = prefix;

			const description = await vscode.window.showInputBox({ prompt: 'Enter snippet description' });
			if (description === undefined) { return; }
			snippet.description = description;

            snippet.buildBody(snippetText); 
			snippetsManager.addSnippet(snippet);
		}
		catch{
			vscode.window.showErrorMessage("An unknown error appear");
		}
        
    }
    var disposable_saveNewSnippet = vscode.commands.registerCommand('dsk.saveNewSnippet', saveNewSnippet);
    context.subscriptions.push(disposable_saveNewSnippet);

    
    var connectHoldId : string;
    async function willSaveQuery(willSave: vscode.TextDocumentWillSaveEvent) {
        connectHoldId = await connectHolder.hangOnToConnection();
    }
    async function utilizeConnection(doc: vscode.TextDocument) {
        await connectHolder.utilizeConnection(doc, connectHoldId);
    }

    context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(willSaveQuery));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(utilizeConnection));

    // dsk.runQuerySection
    var runQuerySection = async () => {
        let endPosition: vscode.Position;
        let startPosition: vscode.Position;
        let cursorPosition: vscode.Position = vscode.window.activeTextEditor.selection.start;
        let eagerRun: boolean = false;
        
        if (vscode.window.activeTextEditor.document.lineAt(cursorPosition.line).isEmptyOrWhitespace || 
            vscode.window.activeTextEditor.document.lineCount - 1 == cursorPosition.line) {
            endPosition = cursorPosition;
        } else {
            // iterate down in document to an empty line to find end of segment
            let j: number = cursorPosition.line+1;
            while ((j <= vscode.window.activeTextEditor.document.lineCount)
                && endPosition == undefined) {
                if (vscode.window.activeTextEditor.document.lineAt(j).isEmptyOrWhitespace || j == vscode.window.activeTextEditor.document.lineCount - 1) {
                    endPosition = new vscode.Position(j,vscode.window.activeTextEditor.document.lineAt(j).range.end.character);
                    
                }
                j++;
            }
        }

        // iterate up in document to find start of segment
        let i: number = cursorPosition.line - 1;
        while (i >= 0 && startPosition == undefined) {
            if (vscode.window.activeTextEditor.document.lineAt(i).isEmptyOrWhitespace) {
                startPosition = new vscode.Position(i,0);
            }
            i--;
        }
        if (startPosition == undefined) {
            startPosition = new vscode.Position(0,0);
        }

        // highlight selection
        vscode.window.activeTextEditor.selections = [];
        vscode.window.activeTextEditor.selection = new vscode.Selection(startPosition, endPosition);

        const workbenchConfig = vscode.workspace.getConfiguration('queryeditorboost');
        eagerRun = workbenchConfig.get('EagerRunQuery');

        if (eagerRun) {
            vscode.commands.executeCommand('runQueryKeyboardAction');
        }
    }
    var disposable_runQuerySection = vscode.commands.registerCommand('dsk.runQuerySection', runQuerySection);
    context.subscriptions.push(disposable_runQuerySection);
}




export function deactivate() {
}