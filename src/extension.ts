// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vue-i18n-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	
	let disposable = vscode.commands.registerTextEditorCommand('vue-i18n-helper.localize', (textEditor, edit) => {	
		// vscode.window.showInformationMessage('Hello World from vue-i18n-helper!');
		const prefix = '{{ $t(\'';
		const suffix = '\') }}';

		const document = textEditor.document;
		const newSelections: vscode.Selection[] = [];

		
		textEditor.edit(editBuilder => {
			textEditor.selections.forEach(selection => {
				editBuilder.insert(selection.start, prefix);
				editBuilder.insert(selection.end, suffix);
				newSelections.push(new vscode.Selection(selection.start.translate(0, 0), 
				selection.end.translate(0, prefix.length + suffix.length)));
				
				const textToLocalize = document.getText(selection);

				let i18nTagStart;
				let i18nTagEnd;

				for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
					const line = document.lineAt(lineNumber);
					if (line.text.match(/<i18n>/)) {
						i18nTagStart = line.range.start;
					}
					if (line.text.match(/<\/i18n>/)) {
						i18nTagEnd = line.range.end;
					}				
				}

				if (i18nTagStart && i18nTagEnd) {
					const i18nTagRange = new vscode.Range(i18nTagStart, i18nTagEnd);
					let i18nTag = document.getText(i18nTagRange);
					
					let i18nValues = i18nTag.replace('<i18n>', '');
					i18nValues = i18nValues.replace('</i18n>', '');
					let i18nTranslations = JSON.parse(i18nValues);
					i18nTranslations['es'][textToLocalize] = textToLocalize;
					i18nTranslations['eu'][textToLocalize] = textToLocalize;

					let newi18nTag = `<i18n>\r\n${JSON.stringify(i18nTranslations, null, 2)}\r\n</i18n>`;
					editBuilder.replace(i18nTagRange, newi18nTag);
				}
				
				vscode.window.showInformationMessage(`Added localized key '${textToLocalize}'`);
			});
		}).then(() => {
			textEditor.selections = newSelections;
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
