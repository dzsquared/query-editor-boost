'use strict'

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export class SnippetExplorerProvider implements vscode.TreeDataProvider<SQLsnippet> {
    private _onDidChangeTreeData: vscode.EventEmitter<SQLsnippet | undefined | void > = new vscode.EventEmitter<SQLsnippet | undefined | void>();


    constructor() {
        vscode.window.showInformationMessage("tree view setup");
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: SQLsnippet): vscode.TreeItem {
        return element;
    }

    getChildren(element?: SQLsnippet): Thenable<SQLsnippet[]> {
        vscode.window.showInformationMessage("getting snippets in getchildren");

        if (element) {
            // getting snippets for each of the collections
            vscode.window.showInformationMessage("getting snippets where element");
            vscode.window.showInformationMessage(element.label);
            return Promise.resolve(this.getSnippets(element.label));
        } else {
            // each snippet collection
            vscode.window.showInformationMessage("getting snippets in else");
            return Promise.resolve(this.getRootSnippets());
        }
    }

    private getSnippets(snippetGroup: string): SQLsnippet[] {
        // function for pulling snippet objects from JSON object
        const pullSnippets = (prefix: string, description: string, body:string[]): SQLsnippet => {
            let scriptText:string = "";
            if (body.length >= 1) {
                body.forEach(function(scriptLine) {
                    scriptText += scriptLine;
                    scriptText += `
    `;
                });
            }
            return new SQLsnippet(prefix, description, scriptText, vscode.TreeItemCollapsibleState.None, {
                command: 'dsk.insertSnippet', 
                title: '',
                arguments: [scriptText]
            });
        }  

        // iterate over different snippet files to put together snippet collection
        let boxSnippetHolder: SQLsnippet[] = [];
        let boxSnippetPath: string = "";
        if (snippetGroup == "AzureDataStudio") {
            switch (os.type()) {
                case 'Darwin':
                    boxSnippetPath = `/Applications/Azure\ Data\ Studio.app/Contents/Resources/app/extensions/mssql/snippets/mssql.json`;
                    break;
                case 'Linux':
                    const removeBasename = dirname => path.parse(dirname).dir
                    const vscodePath = removeBasename(process.env._)
                    boxSnippetPath = path.join(vscodePath, '/resources/app/extensions/mssql/snippets/mssql.json')
                    break;
                case 'Windows_NT':
                    boxSnippetPath = path.join(process.env.AZDATA_CWD, 'resources', 'app', 'extensions','mssql','snippets','mssql.json')
                    break;
            }
            // boxSnippetPath = path.join(__filename, '..','..','src','mssql.json');
            let boxSnippetJSON = JSON.parse(fs.readFileSync(boxSnippetPath, 'utf-8')); 
            console.log(boxSnippetJSON);
            const boxSnippets = Object.keys(boxSnippetJSON).map(snippet => pullSnippets(snippet, boxSnippetJSON[snippet], boxSnippetJSON[snippet].body));
            boxSnippetHolder = boxSnippetHolder.concat(boxSnippets);
        } 
        return boxSnippetHolder;
    }

    private getSnippetFiles(): string[] {
        let pathArray = [];
        // TODO get snippets from user extension folders
        return pathArray;
    }

    private getCustomSnippetFiles(): string[] {
        let pathArray = [];
        let vscode_subdir = (vscode.env.appName.includes("Azure Data Studio - Insiders") ? 'Azure Data Studio - Insiders' : 'Azure Data Studio')
        let settingsPath = "";
        switch (os.type()) {
            case 'Darwin':
                settingsPath = process.env.HOME + `/Library/Application Support/${vscode_subdir}/User/`;
                break;
            case 'Linux':
                settingsPath = process.env.HOME + `/.config/${vscode_subdir}/User/`;
                break;
            case 'Windows_NT':
                settingsPath = process.env.APPDATA + `\\${vscode_subdir}\\User\\`;
                // directorySeparator = "\\";
                break;
            default:
                settingsPath = process.env.HOME + `/.config/${vscode_subdir}/User/`;
                break;
        }

        fs.readdirSync(settingsPath).forEach(file => {
            pathArray.push(file);
        });
        return pathArray;
    }

    private getRootSnippets(): SQLsnippet[] {
        // function for getting snippet containers at root level
        let boxSnippetHolder: SQLsnippet[] = [];
        
        // TODO enable user extension folder snippets
        // const snippetPaths = this.getSnippetFiles();
        // TODO enable user custom snippets

        boxSnippetHolder.push(
            new SQLsnippet("AzureDataStudio", "", null, vscode.TreeItemCollapsibleState.Collapsed
        ));

        return boxSnippetHolder;
    }
}


export class SQLsnippet extends vscode.TreeItem {
	constructor(
		public readonly label: string,
        private readonly version: string,
        public readonly snippetString: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
        // this.snippetString = 
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'SQLsnippet.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'SQLsnippet.svg')
	};

	contextValue = 'SQLsnippet';
}