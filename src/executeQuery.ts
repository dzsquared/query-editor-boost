'use strict';

import * as azdata from 'azdata';
import * as vscode from 'vscode';
import * as parser from 'sqlite-parser';

export class executeQuery {

    public async executeQuery() {
        // check for setting to check where
        let checkWhere:boolean = true;
        let runQuery:boolean = true;
        
        const workbenchConfig = vscode.workspace.getConfiguration('queryeditorboost');
        checkWhere = workbenchConfig.get('WhereClauseChecking');

        if (checkWhere) {
            runQuery = await this.checkWhere(runQuery);
        } 

        // execute query
        if (runQuery) {
            vscode.commands.executeCommand('runQueryKeyboardAction');
        } else {
            let yesNoOptions:vscode.QuickPickItem[] = [
                {label:"Yes"},
                {label:"No"}
            ];
            let yesNo = await vscode.window.showQuickPick(yesNoOptions, {placeHolder: 'This query might be missing a WHERE clause. Execute Query?', ignoreFocusOut: true});
            if (yesNo.label === "Yes") {
                vscode.commands.executeCommand('runQueryKeyboardAction');
            }
        }

    }

    private async checkWhere(runQuery:boolean) {
        let queryText:string = "";
        if (vscode.window.activeTextEditor.selection.isEmpty) {
            queryText = vscode.window.activeTextEditor.document.getText();
        } else {
            let selectedRange:vscode.Range = new vscode.Range(
                vscode.window.activeTextEditor.selection.start,
                vscode.window.activeTextEditor.selection.end
            );
            queryText = vscode.window.activeTextEditor.document.getText(selectedRange);
        }
        try {
            let parsedQuery = parser(queryText);
            console.log(parsedQuery);
            let queryParts = parsedQuery.statement;
            queryParts.forEach( function(queryStatement) {
                if (queryStatement.variant == "update") {
                    if (queryStatement.where == undefined) {
                        runQuery = false;
                    }
                }
            });
            return runQuery;
        } catch {
            console.log("error in parsing query");
            return false;
        }
        
    }
}