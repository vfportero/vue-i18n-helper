// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LocalizeCommand } from './localize.command';
import { ReportContentProvider } from './report.contentprovider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vue-i18n-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vue-i18n-helper.localize', (textEditor, edit) => {	
		new LocalizeCommand().localizeText(textEditor);
	}));

	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('vue-i18n-helper.report', new ReportContentProvider()));

	context.subscriptions.push(vscode.commands.registerCommand('vue-i18n-helper.generatereport', async () => {
		const uri = vscode.Uri.parse('vue-i18n-helper.report:vuei18n-report.json');
		const doc = await vscode.workspace.openTextDocument(uri);
		await vscode.window.showTextDocument(doc, { preview: false });
	}));

}

// this method is called when your extension is deactivated
export function deactivate() {}
