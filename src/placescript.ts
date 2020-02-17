'use strict';

import * as sqlops from 'azdata';
import * as vscode from 'vscode';

export class placeScript {

    private connectionId: string = '';
    private dbName: string = '';

    // places scriptText into fileName editor with current connection
    public async placescript(scriptText:string, context?:sqlops.ObjectExplorerContext) {
        try {
            var connection;
            if (context) {
                let connection = context.connectionProfile;
                this.connectionId = connection.id;
                this.dbName = context.connectionProfile.databaseName;
                await vscode.commands.executeCommand('explorer.query', context.connectionProfile);
            } else {
                await vscode.commands.executeCommand('newQuery');
            }

            let editor = vscode.window.activeTextEditor;
            let doc = editor.document;
            editor.edit(edit => {
                edit.insert(new vscode.Position(0, 0), scriptText);
            });
            
            const workbenchConfig = vscode.workspace.getConfiguration('newquerytemplate');
            let lineAt: number = workbenchConfig.get('DefaultQueryLine');
            let charAt: number = workbenchConfig.get('DefaultQueryCharacter');
            if (lineAt >= 0 && charAt >= 0) {
                let newPosition: vscode.Position = new vscode.Position(lineAt, charAt);
                let newSelection = new vscode.Selection(newPosition, newPosition);
                editor.selection = newSelection;
            }

            if (context && this.dbName) {
                let providerName = context.connectionProfile.providerName;
                let dProvider = await sqlops.dataprotocol.getProvider<sqlops.ConnectionProvider>(providerName, sqlops.DataProviderType.ConnectionProvider);            
                let connectionUri = await sqlops.connection.getUriForConnection(this.connectionId);
                await dProvider.changeDatabase(connectionUri,this.dbName);
                await sqlops.queryeditor.connect(doc.uri.toString(), this.connectionId);
            }
        } catch (err) {
            vscode.window.showErrorMessage(err);
        }
    }

}
