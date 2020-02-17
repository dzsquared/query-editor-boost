# Azure Data Studio - Query Editor Boost

This extension adds several features helpful with query writing in Azure Data Studio:
* [new query template](#new-query-from-template)
* [use database keyboard shortcut](#use-database)
* [run current query section](#run-query-section)
* ~~[reconnects query editor](#reconnects-query-editor)~~
* [friendly snippet editor](#create-new-snippets)

![Query Editor Boost](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/QEboost_wide200.png)


If you have any questions, feel free to reach out to @SysAdminDrew on Twitter or SQLcommunity.slack.com.

Report any bugs or request features here: https://github.com/dzsquared/query-editor-boost/issues

Interested in contributing to this project?  Please check out [CONTRIBUTING](https://github.com/dzsquared/query-editor-boost/blob/master/CONTRIBUTING.md) - a work in progress.


## Installation
The current release is available to [download as a .vsix file](https://github.com/dzsquared/query-editor-boost/releases/download/0.4.1/query-editor-boost-0.4.1.vsix) and can be installed by opening the command palette (`ctrl/command+shift+p`) and selecting `Extensions: Install from VSIX...`

### Setup: New Query Template
Edit the setting for "New Query Template" by creating a new query template in the editor and running the command "QE Boost: Set New Query Template". This setting includes the line and character of the cursor position such that the new query window can place the cursor at the beginning, middle, or end of the template. The new query template settings can also be updated directly in the Azure Data Studio settings.


# Features
* [new query template](#new-query-from-template)
* [use database keyboard shortcut](#use-database)
* [run current query section](#run-query-section)
* ~~[reconnects query editor](#reconnects-query-editor)~~
* [friendly snippet editor](#create-new-snippets)

## New Query from Template
This extension overrides the default "New Query" keyboard shortcut (`ctrl+n`) with a new query window with a query template of your design.  Set the query template  with the command "QE Boost: Set New Query Template" or from the Azure Data Studio settings (`ctrl+,`).
*Note: This extension does not override "New Query" in the file  or object explorer menus.*

![Set and Use New Query Template](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/setNewQueryTemplate.gif)


## Use Database
Change the connected database in a query editor with the "QE Boost: Use Database" command (`ctrl+u`), which opens a searchable picklist. Return to the query editor by hitting `Enter` and your hands never leave the keyboard.

![Use Database Shortcut](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/useDatabase.gif)

## Run Query Section
With multiple queries in the editor, you can run them by "section" - as delineated by line breaks - with the "QE Boost: Run Query Section" (`ctrl+shift+e`).  This command determines where your code is bound by line breaks, highlights that code, then executes the query selection.

![Set and Use New Query Template](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/QuerySegment.gif)


## Reconnects Query Editor
As of January 2020, the Azure Data Studio query editor does not automatically reconnect/stay connected when an "untitled" editor is saved for the first time.  Query Editor Boost handles this for you and immediately reconnects a query the first time you save it.

![Reconnects Query Editor](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/QueryReconnect.gif)

**Feature removed in February 2020.**

## Create New Snippets

When creating new snippets, move quickly through the syntax and manual JSON editing with friendly snippet creation. QEB makes writing new snippet queries easier by placing placeholders (tab stops) and supported variables in the editor window. When your new snippet is ready, save it right away!

### Save the Current Query as a Snippet
Write a new snippet in the query editor and save it directly to your local snippet repository with the command "QE Boost: Save New Snippet."

Extension for VS Code, licensed under MIT license, adapted for use in this extension.
- https://github.com/nikitaKunevich/vscode-snippet-creator (original JavaScript)
- https://github.com/VincentKos/vscode-snippet-creator (TypeScript refactor)

![Save New Snippet](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/snippetSave.gif)

### Insert Placeholders

Use the command "QE Boost: Add Snippet Placeholder" to add placeholders to your query text.  Query Editor Boost will parse repetive use of a placeholder through 99 distinct placeholders.

![Snippet Placeholders](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/snippetPlaceholders.gif)

### Insert Variables

Use the command "QE Boost: Add Snippet Variable" to add snippet variables to your query text.  These variables can automatically insert information such as the current date or directory.

![Snippet Variables](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/snippetVariables.gif)

More info on variables: https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets



# Housekeeping

## Extension Settings

This extension contributes the following settings:

* `newquerytemplate.DefaultQueryTemplate`: the default new query template, an array of strings
* `newquerytemplate.DefaultQueryLine`: the line of the location of cursor placement for new query template, a number
* `newquerytemplate.DefaultQueryCharacter`: the character of the location of cursor placement for new query template, a number
* `queryeditorboost.EagerRunQuery`: ability to disable ctrl/cmd+shift+E shortcut to run current query segment
* `queryeditorboost.telemetry`: ability to disable to telemetry for Query Editor Boost

## Known Issues
None at this time

## Unknown Issues
Can be raised here: https://github.com/dzsquared/query-editor-boost/issues

## Release Notes

### 0.4.1
- Removes reconnect on query editor after editor save due to fix in ADS v1.15.0
- Changes to how new query editor creation and connects is handled to align with ADS v1.15.0

### 0.4.0

- Reconnects query editor after editor save
- Packaged with webpack for performance improvement
- Run current query section shortcut (delineated by empty lines)
- New query option in object explorer context menu
- Moves uninstall script to extension manifest
- Adds telemetry

### 0.3.0

- Adds cursor position to new query template
- Adds MacOS keybindings (cmd)

### 0.2.0

- Fixes to new query from template
- Improvements to snippet placeholder creation

### 0.1.0

- Initial release

## License
[MIT](https://github.com/dzsquared/query-editor-boost/blob/master/LICENSE)

