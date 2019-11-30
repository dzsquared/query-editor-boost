import { actualConnectionInfo, hangOnToConnection, utilizeConnection } from './connectHolder';
import * as vscode from 'vscode';
import * as azdata from 'azdata';

var connectionInfo: actualConnectionInfo;

export async function willSaveQuery(willSave: vscode.TextDocumentWillSaveEvent) {
    connectionInfo = await hangOnToConnection();
}
export async function querySaved(doc: vscode.TextDocument) {
    await utilizeConnection(doc, connectionInfo);
}
