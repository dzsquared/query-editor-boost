'use strict';

import * as azdata from 'azdata';
import * as vscode from 'vscode';


    export async function hangOnToConnection(): Promise<string> {
        let connectProf = await azdata.connection.getCurrentConnection();
        let connectHoldId : string = connectProf.connectionId;
        return connectHoldId;
    }
    
    export async function utilizeConnection(doc: vscode.TextDocument, connectHoldId) {
        await azdata.queryeditor.connect(doc.uri.toString(), connectHoldId);
    }
