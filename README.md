# Azure Data Studio - Query Editor Boost

This extension adds several features helpful with query writing in Azure Data Studio - use database keyboard shortcut, new query window template, and friendly snippet editor.

![Query Editor Boost](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/QEboost200.png)

## Installation
The current release is available to [download as a .vsix file](https://github.com/dzsquared/query-editor-boost/releases/download/0.1.0/query-editor-boost-0.1.0.vsix) and can be installed by opening the command palette (`ctrl/command+shift+p`) and selecting `Extensions: Install from VSIX...`

### Setup: New Query Template
Edit the setting for "New Query Template" in Azure Data Studio settings directly or create a new query template in the editor and run the command "QE Boost: Set New Query Template".


### Uninstalling?
I'm sad to see you go, but before you uninstall I recommended running the command "QE Boost: Reset Dashboard Shortcuts".  This will re-add the original *New Query* button to the server and database dashboards.


## Features

### New Query from Template
This extension overrides the default "New Query" keyboard shortcut (`ctrl+n`) with a new query window with a query template of your design.  Set the query template from Azure Data Studio settings (`ctrl+,`).
*Note: This extension does not override "New Query" in the file menu.*

![Set and Use New Query Template](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/setNewQueryTemplate.gif)


### Use Database
Change the connected database in a query editor with the "QE Boost: Use Database" command (`ctrl+u`), which opens a searchable picklist. Return to the query editor by hitting `Enter` and your hands never leave the keyboard.

![Use Database Shortcut](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/useDatabase.gif)


### Create New Snippets

When creating new snippets, move quickly through the syntax and manual JSON editing with friendly snippet creation.

Makes writing new snippet queries easier by placing placeholders (tab stops) and supported variables in the editor window.

#### Insert Placeholders

![Snippet Placeholders](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/snippetPlaceholders.gif)

#### Insert Variables

![Snippet Variables](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/snippetVariables.gif)

More info on variables: https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets


#### Save the Current Query as a Snippet
Write a new snippet in the query editor and save it directly to your local snippet repository with the command "QE Boost: Save New Snippet."

Extension for VS Code, licensed under MIT license, adapted for use in this extension.
- https://github.com/nikitaKunevich/vscode-snippet-creator (original JavaScript)
- https://github.com/VincentKos/vscode-snippet-creator (TypeScript refactor)

![Save New Snippet](https://raw.githubusercontent.com/dzsquared/query-editor-boost/master/images/snippetSave.gif)





-----------------------------------------------------------------------------------------------------------

## Known Issues

- new query button on Server and Database dashboards is missing icon

## Unknown Issues
Can be raised here: https://github.com/dzsquared/query-editor-boost/issues

## Release Notes

### 0.1.0

- Initial release


-----------------------------------------------------------------------------------------------------------

## Extension Settings

This extension contributes the following settings:

* `newquerytemplate.DefaultQueryTemplate`: the default new query template, an array of strings

