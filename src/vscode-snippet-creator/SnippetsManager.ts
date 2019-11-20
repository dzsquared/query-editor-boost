import Snippet from './Snippet';

import * as os from 'os';
import * as fs from 'fs';
import * as util from 'util';
import * as vscode from 'vscode';
import * as jsonc from 'jsonc-parser';

export default class SnippetsManager {

	addSnippet (snippet: Snippet) {
		var settingsPath: string = '';
		var directorySeparator = '/';

		var vscodeSubdir :string = 'azuredatastudio';

		switch (os.type()) {
			case 'Darwin':
				settingsPath = process.env.HOME + "/Library/Application Support/" + vscodeSubdir + "/User/";
				break;
			case 'Linux':
				settingsPath = process.env.HOME + "/.config/" + vscodeSubdir + "/User/";
				break;
			case 'Windows_NT':
				settingsPath = process.env.APPDATA + "\\" + vscodeSubdir + "\\User\\";
				directorySeparator = "\\";
				break;
			default:
				settingsPath = process.env.HOME + "/.config/" + vscodeSubdir + "/User/";
				break;
        }

		var snippetFile = settingsPath + util.format("snippets%s.json", directorySeparator + snippet.language);

        
		if (!fs.existsSync(snippetFile)) {
			fs.openSync(snippetFile, "w+");
			fs.writeFileSync(snippetFile, '{}');
		}

		fs.readFile(snippetFile, async (err, text) => {
			if (err) {
				return;
			}

			var jsonText = text.toString();
			var parsingErrors: jsonc.ParseError[] = [];
			var snippets = jsonc.parse(jsonText, parsingErrors);

			if (parsingErrors.length > 0) {
				var errors: string[] = [];
				parsingErrors.forEach((e) => {
					var errorText = jsonc.printParseErrorCode(e.error) + " error at the offset " + e.offset;
					errors.push(errorText);
				});

				vscode.window.showErrorMessage("Error" + ((parsingErrors.length > 1) ? "s" : "") + " on parsing current " + snippet.language + " snippet file: " + errors.join(', '));
				return;
			}

			if (snippets[snippet.name] !== undefined) {
                vscode.window.showErrorMessage("A snippet " + snippet.name + " already exists - so adding a unique id");
                let ynOptions = ["No", "Yes"];
                let overwriteYN = await vscode.window.showQuickPick(ynOptions, 
                    { placeHolder: 'Do you want to overwrite a current snippet?', "ignoreFocusOut": true}
                );
				snippet.name = snippet.name + "_" + this.uuidv4();
			}

			this.normalizeSnippet(snippet);

			var edit = jsonc.modify(jsonText, [snippet.name],
				{
					prefix: snippet.prefix,
					body: snippet.body,
					description: snippet.description
				},
				{
					formattingOptions: { // based on default vscode snippet format
						tabSize: 2,
						insertSpaces: false,
						eol: ''
					}
				});

			var fileContent = jsonc.applyEdits(jsonText, edit);
			fs.writeFile(snippetFile, fileContent, () => { });
			vscode.window.showInformationMessage("Snippet " + snippet.name + " added to " + snippet.language + " snippets");
		});
	}

	protected uuidv4 () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	protected normalizeSnippet (snippet: Snippet) {
		if (snippet.prefix === "") {
			snippet.prefix = snippet.name;
		}
		if (snippet.description === "") {
			snippet.description = snippet.name + ' description';
		}
	}

}