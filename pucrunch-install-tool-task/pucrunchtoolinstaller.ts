"use strict";

import tl = require('azure-pipelines-task-lib/task');
import path = require('path');

import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as utils from "./utils";

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function configurePUCrunch() {
    console.log("Starting: configurePUCrunch");
    var version = "1.0.0";
    
    var pucrunchPath = await utils.downloadPUCrunch(version);
    console.log("pucrunchPath: %s", pucrunchPath);

    // prepend the tools path. instructs the agent to prepend for future tasks
    if (!process.env['PATH'].startsWith(path.dirname(pucrunchPath))) {
        toolLib.prependPath(path.dirname(pucrunchPath));
    }
}

async function verifyPUCrunch() {
    console.log("Starting: pucrunch");
    console.log(tl.loc("VerifyPUCrunchInstallation"));

    var toolPath = tl.which("pucrunch", true);
    console.log("acmeToolPath: %s", toolPath);

    var acme = tl.tool(toolPath);
    acme.arg("--version");
    //return acme.exec();
    return true;
}

configurePUCrunch()
    .then(() => verifyPUCrunch())
    .then(() => tl.setResult(tl.TaskResult.Succeeded, ""))
    .catch((error) => tl.setResult(tl.TaskResult.Failed, error));