"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const path = require("path");
const fs = require("fs");
const toolLib = require("azure-pipelines-tool-lib/tool");
const uuidV4 = require('uuid/v4');
const toolName = "pucrunch";
const toolNameWithExtension = toolName + getExecutableExtension();
function downloadPUCrunch(version) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting download PUCrunch (%s)", version);
        var cleanVersion = version;
        var cachedToolpath = toolLib.findLocalTool(toolName, cleanVersion);
        console.log("cachedToolpath: %s", cachedToolpath);
        if (!cachedToolpath) {
            try {
                var downloadPath = yield toolLib.downloadTool(getDownloadURL(version), toolName + "-" + uuidV4() + getArchiveExtension());
                console.log("downloadPath: %s", downloadPath);
            }
            catch (exception) {
                throw new Error(tl.loc("PUCrunchDownloadFailed", getDownloadURL(version), exception));
            }
            var unzipedPath;
            unzipedPath = yield toolLib.extractZip(downloadPath);
            console.log("unzipedPath: %s", unzipedPath);
            unzipedPath = path.join(unzipedPath, toolNameWithExtension);
            console.log("unzipedPath: %s", unzipedPath);
            cachedToolpath = yield toolLib.cacheFile(unzipedPath, toolNameWithExtension, toolName, cleanVersion);
            console.log("cachedToolpath: %s", cachedToolpath);
        }
        var PUCrunchpath = findPUCrunch(cachedToolpath);
        console.log("PUCrunchpath: %s", PUCrunchpath);
        if (!PUCrunchpath) {
            throw new Error(tl.loc("PUCrunchNotFoundInFolder", cachedToolpath));
        }
        fs.chmodSync(PUCrunchpath, "777");
        return PUCrunchpath;
    });
}
exports.downloadPUCrunch = downloadPUCrunch;
function findPUCrunch(rootFolder) {
    console.log("Starting findPUCrunch(%s)", rootFolder);
    var pucrunchPath = path.join(rootFolder, toolNameWithExtension);
    console.log(" pucrunchPath: %s", pucrunchPath);
    var allPaths = tl.find(rootFolder);
    var matchingResultsFiles = tl.match(allPaths, pucrunchPath, rootFolder);
    return matchingResultsFiles[0];
}
function getDownloadURL(version) {
    return "https://csdb.dk/release/download.php?id=100229";
}
function getExecutableExtension() {
    //    if (isWindows) {
    return ".exe";
    //  }
    //return "";
}
function getArchiveExtension() {
    //if(isWindows) {
    return ".zip";
    //}
    //return ".tgz";
}
