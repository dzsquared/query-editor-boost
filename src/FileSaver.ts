import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';

export class FileSaver {

    public async saveThis(textDoc:vscode.TextDocument) {
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

        var newFileAbsolutePath = settingsPath + 'tempquery.sql';
         //+ util.format("snippets%s.json", directorySeparator + snippet.language);

        // var oldDocText = fs.readFileSync(oldFileAbsolutePath);
        let oldDocText:string = textDoc.getText();
        // let newFileAbsolutePath:string = '';
        fs.writeFileSync(newFileAbsolutePath, oldDocText);

        const finalUri = vscode.Uri.file(newFileAbsolutePath);
        vscode.workspace.openTextDocument(finalUri).then((doc) => {
            vscode.window.showTextDocument(doc, {preview: false});
        });
    }
}