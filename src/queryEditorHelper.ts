import { actualConnectionInfo, hangOnToConnection, utilizeConnection } from './connectHolder';
import * as vscode from 'vscode';

var connectionInfo: actualConnectionInfo;

export async function willSaveQuery(willSave: vscode.TextDocumentWillSaveEvent) {
    if (willSave.document.uri.scheme == "file") {
        connectionInfo = await hangOnToConnection();
    }
}
export async function querySaved(doc: vscode.TextDocument) {
    if (doc.uri.scheme == "file") {
        await utilizeConnection(doc, connectionInfo);
    }
}
