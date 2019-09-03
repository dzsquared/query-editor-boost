'use strict';

import * as sqlops from 'azdata';
import * as vscode from 'vscode';

export class placeScript {
    // places scriptText into fileName editor with current connection
    public async placescript(scriptText) {
        try {
            let connection = await sqlops.connection.getCurrentConnection();
            let doc = await vscode.workspace.openTextDocument({language: 'sql'});
            let editor = await vscode.window.showTextDocument(doc, 1, false);
            editor.edit(edit => {
                edit.insert(new vscode.Position(0, 0), scriptText);
            });

            if (connection.connectionId) {
                await sqlops.queryeditor.connect(doc.uri.toString(), connection.connectionId);
            }
        } catch (err) {
            vscode.window.showErrorMessage(err);
        }
    }

    
    // places scriptText into fileName editor with current connection
    public async placescriptAdv(scriptText, fileName, langId) {
        try {
            let connection = await sqlops.connection.getCurrentConnection();
            
            var setting: vscode.Uri = vscode.Uri.parse("untitled:" + fileName);
            let doc = await vscode.workspace.openTextDocument(setting);
            vscode.languages.setTextDocumentLanguage(doc, langId);
            
            let editor = await vscode.window.showTextDocument(doc, 1, false);
            editor.edit(edit => {
                edit.insert(new vscode.Position(0, 0), scriptText);
            });
            if (connection.connectionId) {
                await sqlops.queryeditor.connect(doc.uri.toString(), connection.connectionId);
            }
        } catch (err) {
            vscode.window.showErrorMessage(err);
        }
    }

}
