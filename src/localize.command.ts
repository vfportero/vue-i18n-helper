import * as vscode from 'vscode';
import Helpers from './helpers';
import { LocaleMessages } from './models';

export class LocalizeCommand {

  languages = vscode.workspace.getConfiguration('vuei18nhelper').languages.split(',');
  inlinedVariableRegExp = new RegExp(/.({{[^}]*}})/);
  inlinedHtmlRegExp = new RegExp(/.<[^>]*>/);

  public localizeText(textEditor: vscode.TextEditor) {

		const document = textEditor.document;

    textEditor.edit(editBuilder => {
      textEditor.selections.forEach(selection => {
        if (!selection.isSingleLine) {
          vscode.window.showInformationMessage(`⚠️ Extract multiline literals is not allowed`);
        } else {
          const vueBlock = this.getVueBlock(document, selection);

          const textToLocalize = this.replaceSelector(document, editBuilder, selection, vueBlock);

          let currentFileTranslations = this.getCurrentFileTranslations(document);

          for (const lang of this.languages) {
            currentFileTranslations.i18nTranslations[lang][textToLocalize] = textToLocalize;  
          };
          

          let newi18nTag = `${currentFileTranslations.i18nTagExists === false ? '\r\n\r\n': ''}<i18n>\r\n${JSON.stringify(currentFileTranslations.i18nTranslations, null, 2)}\r\n</i18n>`;
  
          editBuilder.replace(currentFileTranslations.i18nTagRange, newi18nTag);
          
          vscode.window.showInformationMessage(`Added localized key '${textToLocalize}'`);
        }
      });
    });
  }

  private getVueBlock(document: vscode.TextDocument, selection: vscode.Selection): 'script' | 'template' {
    for (let line = selection.end.line; line < document.lineCount; line++) {
      const lineRange = document.lineAt(line);
      if (lineRange.text.match(/<\/template>/)) {
        return 'template';
      }
    }

    return 'script';
  }

  private replaceSelector(document: vscode.TextDocument, editBuilder: vscode.TextEditorEdit, selection: vscode.Selection, vueBlock: 'script' | 'template'): string {
    let textToReplace = document.getText(selection);
    
    let inlineVariableNames = [];

    let inlinedVariableMatch = this.inlinedVariableRegExp.exec(textToReplace);

    while (inlinedVariableMatch !== null) {   
      let inlineVariable = inlinedVariableMatch[1];
      const inlineVariableName = inlineVariable.replace('{{', '').replace('}}', '');
      inlineVariableNames.push(inlineVariableName);
      textToReplace = textToReplace.replace(inlineVariable, `{${inlineVariableName}}`);
      inlinedVariableMatch = this.inlinedVariableRegExp.exec(textToReplace);
    }

    if (inlineVariableNames.length) {
      editBuilder.replace(selection, `{{ $t(\'${textToReplace}\', { ${inlineVariableNames.join(',')} })}}`);
    } else {
      switch (vueBlock) {
        case 'script': {
          const start = new vscode.Position(selection.start.line, Math.max(selection.start.character - 1, 0));
          const end = new vscode.Position(selection.end.line, selection.end.character + 1);

          editBuilder.replace(new vscode.Selection(start, end), `this.$t(\'${textToReplace}\')`);
          break;
        }
        case 'template': {
          if (this.inlinedHtmlRegExp.test(textToReplace)) {
            editBuilder.replace(selection, `<span v-html="$t(\'${textToReplace}\')"></span>`);
          } else {
            editBuilder.replace(selection, `{{ $t(\'${textToReplace}\')}}`);
          }
          
          break;
        }
      }
    }
    
    return textToReplace;
  }

  private getCurrentFileTranslations(document: vscode.TextDocument): { i18nTranslations: LocaleMessages, i18nTagRange: vscode.Range, i18nTagExists: boolean }   {
    let i18TagContent = Helpers.geti18nTagContent(document);

    let i18nTranslations: LocaleMessages = {};
    
    for (const lang of this.languages) {
      i18nTranslations[lang] = {};
    }

    let i18nTagRange: vscode.Range;
    let i18nTagExists = i18TagContent !== null;

    if (i18TagContent !== null) {
      i18nTagRange = i18TagContent.i18nTagRange;
      i18nTranslations = {
        ...i18nTranslations,
        ...i18TagContent.i18nTranslations
      };
    } else {
      i18nTagRange = new vscode.Range(new vscode.Position(document.lineCount,0), new vscode.Position(document.lineCount,0));
    }

    return { i18nTranslations, i18nTagRange, i18nTagExists };
  }
}