"use strict";

import tl = require('azure-pipelines-task-lib/task');
import path = require('path');

import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as utils from "./utils";

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function configureACME() {
    console.log("Starting: configureACME");
    var version = tl.getInput("acmeVersion", true);
    console.log("version: %s", version);
    
    var acmePath = await utils.downloadACME(version);
    console.log("acmePath: %s", acmePath);

    // prepend the tools path. instructs the agent to prepend for future tasks
    if (!process.env['PATH'].startsWith(path.dirname(acmePath))) {
        toolLib.prependPath(path.dirname(acmePath));
    }
}

async function verifyACME() {
    console.log("Starting: verifyACME");
    console.log(tl.loc("VerifyACMEInstallation"));

    var acmeToolPath = tl.which("acme", true);
    console.log("acmeToolPath: %s", acmeToolPath);

    var acme = tl.tool(acmeToolPath);
    acme.arg("--version");
    return acme.exec();
}

configureACME()
    .then(() => verifyACME())
    .then(() => tl.setResult(tl.TaskResult.Succeeded, ""))
    .catch((error) => tl.setResult(tl.TaskResult.Failed, error));