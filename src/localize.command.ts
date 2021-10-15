import * as vscode from 'vscode';
import { LocaleMessages } from './models';

export class LocalizeCommand {


  public localizeText(textEditor: vscode.TextEditor) {

		const document = textEditor.document;

    textEditor.edit(editBuilder => {
      textEditor.selections.forEach(selection => {
        const textToLocalize = this.replaceSelector(document, editBuilder, selection);

        let currentFileTranslations = this.getCurrentFileTranslations(document);
        
        currentFileTranslations.i18nTranslations['es'][textToLocalize] = textToLocalize;
        currentFileTranslations.i18nTranslations['eu'][textToLocalize] = textToLocalize;
        let newi18nTag = `<i18n>\r\n${JSON.stringify(currentFileTranslations.i18nTranslations, null, 2)}\r\n</i18n>`;

        editBuilder.replace(currentFileTranslations.i18nTagRange, newi18nTag);
				
        vscode.window.showInformationMessage(`Added localized key '${textToLocalize}'`);
      });
    });
  }

  private replaceSelector(document: vscode.TextDocument, editBuilder: vscode.TextEditorEdit, selection: vscode.Selection): string {
    let textToReplace = document.getText(selection);
    const inlinedVariableRegExp = new RegExp(/.({{[^}]*}})/);
    let inlineVariableNames = [];

    let inlinedVariableMatch = inlinedVariableRegExp.exec(textToReplace);

    while (inlinedVariableMatch !== null) {   
      let inlineVariable = inlinedVariableMatch[1];
      const inlineVariableName = inlineVariable.replace('{{', '').replace('}}', '');
      inlineVariableNames.push(inlineVariableName);
      textToReplace = textToReplace.replace(inlineVariable, `{${inlineVariableName}}`);
      inlinedVariableMatch = inlinedVariableRegExp.exec(textToReplace);
    }

    if (inlineVariableNames.length) {
      editBuilder.replace(selection, `{{ $t(\'${textToReplace}\', { ${inlineVariableNames.join(',')} })}}`);
    } else {
      editBuilder.replace(selection, `{{ $t(\'${textToReplace}\')}}`);
    }
    
    return textToReplace;
  }

  private getCurrentFileTranslations(document: vscode.TextDocument): { i18nTranslations: LocaleMessages, i18nTagRange: vscode.Range }   {
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

    let i18nTranslations: LocaleMessages = {
      ['es']: {},
      ['eu']: {}
    };

    let i18nTagRange: vscode.Range;

    if (i18nTagStart && i18nTagEnd) {
      i18nTagRange = new vscode.Range(i18nTagStart, i18nTagEnd);
      let i18nTag = document.getText(i18nTagRange);
      
      let i18nValues = i18nTag.replace('<i18n>', '');
      i18nValues = i18nValues.replace('</i18n>', '');
      i18nTranslations = {
        ...i18nTranslations,
        ...JSON.parse(i18nValues)
      };
    } else {
      i18nTagRange = new vscode.Range(new vscode.Position(document.lineCount,0), new vscode.Position(document.lineCount,0));
    }

    return { i18nTranslations, i18nTagRange };
  }
}