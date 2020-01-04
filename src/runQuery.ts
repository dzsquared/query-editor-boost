'use strict';
import * as vscode from 'vscode';

export async function runQuerySection() {
    let eagerRun: boolean = false;

    const workbenchConfig = vscode.workspace.getConfiguration('queryeditorboost');
    eagerRun = workbenchConfig.get('EagerRunQuery');

    if (eagerRun) {    
        let endPosition: vscode.Position;
        let startPosition: vscode.Position;
        let cursorPosition: vscode.Position = vscode.window.activeTextEditor.selection.start;
        
        if (vscode.window.activeTextEditor.document.lineAt(cursorPosition.line).isEmptyOrWhitespace || 
            vscode.window.activeTextEditor.document.lineCount - 1 == cursorPosition.line) {
            endPosition = vscode.window.activeTextEditor.document.lineAt(cursorPosition.line).range.end;
            //cursorPosition;
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

        vscode.commands.executeCommand('runQueryKeyboardAction');
    }
}