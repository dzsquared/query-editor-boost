import * as connectHolder from './connectHolder';
import * as vscode from 'vscode';

var connectHoldId : string;

export async function willSaveQuery(willSave: vscode.TextDocumentWillSaveEvent) {
    connectHoldId = await connectHolder.hangOnToConnection();
}
export async function utilizeConnection(doc: vscode.TextDocument) {
    await connectHolder.utilizeConnection(doc, connectHoldId);
}