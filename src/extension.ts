'use strict';
import * as vscode from 'vscode';
import * as azdata from 'azdata';

import { changeDatabase } from './changeDatabase';
import { initQEB } from './settingsUpdates';
import { setEagerRunContext } from './contextSettings';
import { willSaveQuery, querySaved } from './queryEditorHelper';
import { addSnippetPlaceholder, addSnippetVariable, saveNewSnippet } from './snippetHelper';
import { runQuerySection } from './runQuery';

import { placeScript } from './placescript';
import { telemetryHelper } from './telemetryHelper';

// var tH: telemetryHelper;

export function activate(context: vscode.ExtensionContext) {
    // query section execution keyboard shortcut setting
    setEagerRunContext();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(setEagerRunContext));

    // patches text editor save and query connection
    context.subscriptions.push(vscode.workspace.onWillSaveTextDocument( (willSave: vscode.TextDocumentWillSaveEvent) => willSaveQuery(willSave) ));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument( (doc: vscode.TextDocument) => querySaved(doc) ));
    
    // telemetry setup
    var tH = new telemetryHelper(context);
    tH.sendTelemetry('activated', { }, { });

    // setup the dashboard task buttons
    initQEB();
    
    //dsk.createQueryTemplate
    var createQueryTemplate = async () => {
        tH.sendTelemetry('createQueryTemplate', { }, { });

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
    var newQueryOption = async (context?: azdata.ObjectExplorerContext) => {
        tH.sendTelemetry('newQueryOption', { }, { });

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
        new placeScript().placescript(scriptText, context);
    };
    vscode.commands.registerCommand('dsk.newqueryoption', newQueryOption);
    azdata.tasks.registerTask('dsk.newqueryoption', ((profile?: azdata.IConnectionProfile, context?: azdata.ObjectExplorerContext) => newQueryOption(context)));
    
    var useDatabaseCmd = () => {
        tH.sendTelemetry('useDatabaseCmd', { }, { });
        azdata.connection.getCurrentConnection().then( connection =>  {
            if (connection) {
                let databaseList = azdata.connection.listDatabases(connection.connectionId);
                changeDatabase(databaseList, connection);
            } else {
                vscode.window.showErrorMessage("No connection found.  Connect before switching databases.");
            }
        }, error => {
            console.info(error);
        });
    }
    var disposable_useDatabase = vscode.commands.registerCommand('dsk.useDatabase', useDatabaseCmd);
    context.subscriptions.push(disposable_useDatabase);

    var disposable_addSnippetPlaceholder = vscode.commands.registerCommand('dsk.addSnippetPlaceholder', addSnippetPlaceholder);
    context.subscriptions.push(disposable_addSnippetPlaceholder);

    var disposable_addSnippetVariable = vscode.commands.registerCommand('dsk.addSnippetVariable', addSnippetVariable);
    context.subscriptions.push(disposable_addSnippetVariable);

    var disposable_saveNewSnippet = vscode.commands.registerCommand('dsk.saveNewSnippet', (tH) => saveNewSnippet(tH));
    context.subscriptions.push(disposable_saveNewSnippet);

    var RunQuerySection = (tH: telemetryHelper) => {
        runQuerySection(tH);
    }
    var disposable_runQuerySection = vscode.commands.registerCommand('dsk.runQuerySection', RunQuerySection);
    context.subscriptions.push(disposable_runQuerySection);

}




export function deactivate() {
}