'use strict';

import * as azdata from 'azdata';
import * as vscode from 'vscode';
import * as parser from 'node-sql-parser';

export class queryListener {
    private qeListener: azdata.queryeditor.QueryEventListener;

    public async parseQuery() {
        azdata.queryeditor.registerQueryEventListener(this.qeListener);
        
    }

}