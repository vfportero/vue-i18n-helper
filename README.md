# vue-i18n-helper README

This plugin allow a useful tool to create localizated keys to your Vue application using Vue I18N.

## Features

### Localize text literal

- Extract literal text to a localized key in the `<i18n>` tag of your `.vue` file (from `<template>` and `<script>` tags)

![localize](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/localize.gif)
![localize-script](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/localize-script.gif)

- Extraction of inlined variable texts and HTML:

![localize-inlined-variable](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/localize-with-inlined-variable.gif)

- Extracion of inlined HTML to replace by span (only in <vue> tag)

![localize-inlined-html](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/localize-inline-html.gif)

This command gets the selected text and create a new key on the existent `<i18n>` (or create new one if not exists) in every configured language on the plugin settings.

### Export localized keys to JSON

This command generates a JSON file with all localized keys:

![export](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/export.gif)

## Requirements

- vue-i18n
- @kazupon/vue-i18n-loader

## Extension Settings

This extension contributes the following settings:

* `vuei18nhelper.languages`: Language keys (comma separated)

![settings](https://raw.githubusercontent.com/vfportero/vue-i18n-helper/master/settings.png)