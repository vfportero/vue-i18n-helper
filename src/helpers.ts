import * as vscode from 'vscode';
import { LocaleMessages } from './models';

export default class Helpers {
  public static geti18nTagContent(document: vscode.TextDocument): { i18nTranslations: LocaleMessages, i18nTagRange: vscode.Range } | null {
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

    let i18nTagRange: vscode.Range;

    if (i18nTagStart && i18nTagEnd) {
      i18nTagRange = new vscode.Range(i18nTagStart, i18nTagEnd);
      let i18nTag = document.getText(i18nTagRange);
      
      let i18nValues = i18nTag.replace('<i18n>', '');
      i18nValues = i18nValues.replace('</i18n>', '');
      return { i18nTranslations: JSON.parse(i18nValues), i18nTagRange } ;
    };

    return null;
  }
}