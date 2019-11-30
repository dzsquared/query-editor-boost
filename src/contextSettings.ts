'use strict';
import * as vscode from 'vscode';

export function setEagerRunContext() {
    const workbenchConfig = vscode.workspace.getConfiguration('queryeditorboost');
    let eagerRun = workbenchConfig.get('EagerRunQuery');

    if (eagerRun) { 
        vscode.commands.executeCommand('setContext', 'EagerRunQuery', true);
    } else {
        vscode.commands.executeCommand('setContext', 'EagerRunQuery', false);
    }
}