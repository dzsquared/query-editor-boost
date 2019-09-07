'use strict';

import * as sqlops from 'azdata';
import * as vscode from 'vscode';

export class placeScript {

    private connectionId: string = '';
    private dbName: string = '';

    // places scriptText into fileName editor with current connection
    public async placescript(scriptText:string, context?:sqlops.IConnectionProfile, oecontext?: sqlops.ObjectExplorerContext) {
        try {
            var connection;
            vscode.window.showInformationMessage('starting placescript');
            if (context && context.id) {
                this.connectionId = context.id;
                this.dbName = context.databaseName;
            } else if (oecontext) {
                connection = oecontext.connectionProfile;
                this.connectionId = connection.id;
            } else {
                connection = await sqlops.connection.getCurrentConnection();
                if (connection) {
                    this.connectionId = connection.connectionId;
                    this.dbName = connection.databaseName;
                }
            }
            let doc = await vscode.workspace.openTextDocument({language: 'sql'});
            let editor = await vscode.window.showTextDocument(doc, 1, false);
            editor.edit(edit => {
                edit.insert(new vscode.Position(0, 0), scriptText);
            });
            if ((context || connection) && this.connectionId) {
                if (this.dbName !== '') {
                    var providerName:string;
                    if (context) {
                        providerName = context.providerName;
                    } else if (connection) {
                        providerName = connection.providerId;
                    }
                    let dProvider = await sqlops.dataprotocol.getProvider<sqlops.ConnectionProvider>(providerName, sqlops.DataProviderType.ConnectionProvider);            
                    let connectionUri = await sqlops.connection.getUriForConnection(this.connectionId);
                    await dProvider.changeDatabase(connectionUri,this.dbName);
                }
                await sqlops.queryeditor.connect(doc.uri.toString(), this.connectionId);
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
