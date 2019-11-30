'use strict';

import * as azdata from 'azdata';
import * as vscode from 'vscode';


export async function changeDatabase(databaseList, connection) {
    let connectionUri = await azdata.connection.getUriForConnection(connection.connectionId);
    let dProvider = await azdata.dataprotocol.getProvider<azdata.ConnectionProvider>(connection.providerId, azdata.DataProviderType.ConnectionProvider);
    
    if (dProvider.providerId == "MSSQL") {
        let selectedDatabase = await vscode.window.showQuickPick(databaseList, 
            { placeHolder: 'Select Database', "ignoreFocusOut": true}
        );
        let useThisDB = selectedDatabase;
        
        await dProvider.changeDatabase(connectionUri,useThisDB);
        await azdata.queryeditor.connect(vscode.window.activeTextEditor.document.uri.toString(), connection.connectionId);
    } else {
        vscode.window.showErrorMessage("Sorry, use database is only supported for MS SQL");
    }
};

