import * as vscode from 'vscode';
import Helpers from './helpers';
import { LocaleFiles, LocaleMessages } from './models';

export class ReportCommand {


  public async generateKeysReport() {
    let localizationKeysReport: LocaleFiles = {};
    
    let vueFiles = await vscode.workspace.findFiles('**/*.vue', '**/node_modules/**');
    let localeFiles = await vscode.workspace.findFiles('**/locale/*.json', '**/node_modules/**');

    localizationKeysReport = {
      ...localizationKeysReport,
      ... await this.getLocalizationKeys(vueFiles, 'vue'),
      ... await this.getLocalizationKeys(localeFiles, 'locale'),
    };

    console.log(JSON.stringify(localizationKeysReport, null, 2));
  }

  private async getLocalizationKeys(files: vscode.Uri[], fileType: 'vue' | 'locale'): Promise<LocaleFiles> {
    let localizationKeysReport: LocaleFiles = {};

    for (const vueFile of files) {
      const fileDocument = await vscode.workspace.openTextDocument(vueFile);

      let i18nTranslations: LocaleMessages | undefined;
      if (fileType === 'vue') {
        const i18TagContent = Helpers.geti18nTagContent(fileDocument);
        i18nTranslations = i18TagContent?.i18nTranslations;
      } else {
        i18nTranslations = JSON.parse(fileDocument.getText());
      }
      

      if (i18nTranslations && vscode.workspace.workspaceFolders) {
        for (const wsFolder of vscode.workspace.workspaceFolders) {
          if (vueFile.fsPath.startsWith(wsFolder.uri.fsPath)) {
            const fileKey = vueFile.fsPath.replace(wsFolder.uri.fsPath, '');
            localizationKeysReport[fileKey] = i18nTranslations;
            break;
          }
        }
      }
    }

    return localizationKeysReport;
  }

  
}