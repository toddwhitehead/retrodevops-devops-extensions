"use strict";

import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import fs = require('fs');
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as os from "os";
import * as util from "util";

const uuidV4 = require('uuid/v4');
const toolName = "pucrunch";
const toolNameWithExtension = toolName + getExecutableExtension();

export async function downloadPUCrunch(version: string): Promise<string> {
    console.log("Starting download PUCrunch (%s)", version);
    var cleanVersion = version; 
    var cachedToolpath = toolLib.findLocalTool(toolName, cleanVersion);

    console.log("cachedToolpath: %s", cachedToolpath);

    if (!cachedToolpath) {
        try {
            var downloadPath = await toolLib.downloadTool(getDownloadURL(version), toolName + "-" + uuidV4() + getArchiveExtension());
            console.log("downloadPath: %s", downloadPath);            
        } catch (exception) {
            throw new Error(tl.loc("PUCrunchDownloadFailed", getDownloadURL(version), exception));
        }

        var unzipedPath;
        unzipedPath = await toolLib.extractZip(downloadPath);     
        
        console.log("unzipedPath: %s", unzipedPath);  

        unzipedPath = path.join(unzipedPath, toolNameWithExtension);
        console.log("unzipedPath: %s", unzipedPath);

        cachedToolpath = await toolLib.cacheFile(unzipedPath, toolNameWithExtension, toolName, cleanVersion);
        console.log("cachedToolpath: %s", cachedToolpath);
    }

    var PUCrunchpath = findPUCrunch(cachedToolpath);
    console.log("PUCrunchpath: %s", PUCrunchpath);

    if (!PUCrunchpath) {
        throw new Error(tl.loc("PUCrunchNotFoundInFolder", cachedToolpath))
    }

    fs.chmodSync(PUCrunchpath, "777");
    return PUCrunchpath;
}

function findPUCrunch(rootFolder: string) {
    console.log("Starting findPUCrunch(%s)", rootFolder);
    var pucrunchPath = path.join(rootFolder,  toolNameWithExtension);
    console.log(" pucrunchPath: %s", pucrunchPath);

    var allPaths = tl.find(rootFolder);
    var matchingResultsFiles = tl.match(allPaths, pucrunchPath, rootFolder);
    return matchingResultsFiles[0];
}


function getDownloadURL(version: string): string {
    return "https://csdb.dk/release/download.php?id=100229";
}

function getExecutableExtension(): string {
//    if (isWindows) {
        return ".exe";
  //  }
    //return "";
}

function getArchiveExtension(): string {
    //if(isWindows) {
        return ".zip";
    //}
    //return ".tgz";
}