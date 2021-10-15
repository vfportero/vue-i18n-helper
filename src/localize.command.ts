import * as vscode from 'vscode';
import { LocaleMessages } from './models';

export class LocalizeCommand {

  prefix = '{{ $t(\'';
  suffix = '\') }}';

  public localizeText(textEditor: vscode.TextEditor) {

		const document = textEditor.document;
		const newSelections: vscode.Selection[] = [];

		
		textEditor.edit(editBuilder => {
			textEditor.selections.forEach(selection => {
				editBuilder.insert(selection.start, this.prefix);
				editBuilder.insert(selection.end, this.suffix);
				newSelections.push(new vscode.Selection(selection.start.translate(0, 0), 
				selection.end.translate(0, this.prefix.length + this.suffix.length)));
				
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
        
        i18nTranslations['es'][textToLocalize] = textToLocalize;
        i18nTranslations['eu'][textToLocalize] = textToLocalize;
        let newi18nTag = `<i18n>\r\n${JSON.stringify(i18nTranslations, null, 2)}\r\n</i18n>`;

        editBuilder.replace(i18nTagRange, newi18nTag);
        
				
				vscode.window.showInformationMessage(`Added localized key '${textToLocalize}'`);
			});
		}).then(() => {
			textEditor.selections = newSelections;
		});
  }
}