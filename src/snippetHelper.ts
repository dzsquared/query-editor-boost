'use strict';
import * as vscode from 'vscode';
import Snippet from "./vscode-snippet-creator/Snippet";
import SnippetsManager from "./vscode-snippet-creator/SnippetsManager";

export async function addSnippetPlaceholder() {
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

export async function addSnippetVariable() {
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

export async function saveNewSnippet() {
    
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