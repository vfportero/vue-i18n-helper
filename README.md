# vue-i18n-helper README

This plugin allow a useful tool to create localizated keys to your Vue application using Vue I18N.

## Features

### Localize text literal

- Extract literal text to a localized key in the `<i18n>` tag of your `.vue` file:

![localize](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/localize.gif)

- Also allows extraction of inlined variable texts and HTML:

![localize-inlined-variable](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/localize-with-inlined-variable.gif)

This command gets the selected text and create a new key on the existent `<i18n>` (or create new one if not exists) in every configured language on the plugin settings.

### Generate localized keys report

This command generates a json report with all localized keys:

![generate-report](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/generate-report.gif)

## Requirements

- vue-i18n
- @kazupon/vue-i18n-loader

## Extension Settings

This extension contributes the following settings:

* `vuei18nhelper.languages`: Language keys (comma separated)

![settings](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/settings.png)



## Release Notes

### 0.0.1

Initial release
