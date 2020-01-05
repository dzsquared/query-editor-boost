import * as vscode from 'vscode';
import * as telemetryConnect from  './telemetryConnect';

// extension telemetry
import TelemetryReporter from 'vscode-extension-telemetry';
const extensionId = 'drewsk.query-editor-boost';
const extension = vscode.extensions.getExtension(extensionId);
let telemetryconnect: telemetryConnect.telemetryConnect = require('../telemetryConnect.json');
const extensionVersion = extension.packageJSON.version;
const key = telemetryconnect.token;  

export class telemetryHelper {
    public reporter: TelemetryReporter;

    constructor(context:vscode.ExtensionContext) {
        this.reporter = new TelemetryReporter(extensionId, extensionVersion, key);
        context.subscriptions.push(this.reporter);
    }

    public sendTelemetry(eventName:string, stringObj:any, numericObj:any) {
        var theSettings = vscode.workspace.getConfiguration();
        if  ( theSettings.get('queryeditorboost.telemetry') && theSettings.get('telemetry.enableTelemetry') ) {
            this.reporter.sendTelemetryEvent(eventName, stringObj, numericObj);
        }
    }

}