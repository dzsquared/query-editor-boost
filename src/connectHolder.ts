'use strict';

import * as azdata from 'azdata';
import * as vscode from 'vscode';


    export async function hangOnToConnection(): Promise<actualConnectionInfo> {
        let connectProf = await azdata.connection.getCurrentConnection();
        let connectHoldId : string = '';
        let dbName: string = '';
        let providerId: string = '';
        connectHoldId = connectProf.connectionId;
        dbName = connectProf.databaseName;
        providerId = connectProf.providerId;
        
        return {connectHoldId: connectHoldId, dbName: dbName, providerId: providerId};
    }
    
    export async function utilizeConnection(doc: vscode.TextDocument, actualConnectionInfo: actualConnectionInfo) {
        if ( actualConnectionInfo.connectHoldId ) { 
            if (actualConnectionInfo.dbName !== '') {
                let dProvider = await azdata.dataprotocol.getProvider<azdata.ConnectionProvider>(actualConnectionInfo.providerId, azdata.DataProviderType.ConnectionProvider);            
                let connectionUri = await azdata.connection.getUriForConnection(actualConnectionInfo.connectHoldId);
                await dProvider.changeDatabase(connectionUri,actualConnectionInfo.dbName);
                await azdata.queryeditor.connect(doc.uri.toString(), actualConnectionInfo.connectHoldId);
            }
        }

    }

    
    export class actualConnectionInfo {
        connectHoldId: string;
        dbName: string;
        providerId: string;
    }