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
const acmeToolName = "acme";
//const isWindows = os.type().match(/^Win/);
const acmeToolNameWithExtension = acmeToolName + getExecutableExtension();
function downloadACME(version) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting downloadACME(%s)", version);
        var cleanVersion = version; //version.replace(/(0+)([1-9]+)/,"$2");
        var cachedToolpath = toolLib.findLocalTool(acmeToolName, cleanVersion);
        console.log("cachedToolpath: %s", cachedToolpath);
        if (!cachedToolpath) {
            try {
                var acmeDownloadPath = yield toolLib.downloadTool(getACMEDownloadURL(version), acmeToolName + "-" + uuidV4() + getArchiveExtension());
                console.log("acmeDownloadPath: %s", acmeDownloadPath);
            }
            catch (exception) {
                throw new Error(tl.loc("ACMEDownloadFailed", getACMEDownloadURL(version), exception));
            }
            var unzipedACMEPath;
            unzipedACMEPath = yield toolLib.extractZip(acmeDownloadPath);
            console.log("unzipedACMEPath: %s", unzipedACMEPath);
            //contents of the extracted archive are under "acme0.96.4win\acme" directory. caching only "acme(.exe)" CLI
            unzipedACMEPath = path.join(unzipedACMEPath, "acme0.96.4win", "acme", acmeToolNameWithExtension);
            console.log("unzipedACMEPath: %s", unzipedACMEPath);
            cachedToolpath = yield toolLib.cacheFile(unzipedACMEPath, acmeToolNameWithExtension, acmeToolName, cleanVersion);
            console.log("cachedToolpath: %s", cachedToolpath);
        }
        var ACMEpath = findACME(cachedToolpath);
        console.log("ACMEpath: %s", ACMEpath);
        if (!ACMEpath) {
            throw new Error(tl.loc("ACMENotFoundInFolder", cachedToolpath));
        }
        fs.chmodSync(ACMEpath, "777");
        return ACMEpath;
    });
}
exports.downloadACME = downloadACME;
function findACME(rootFolder) {
    console.log("Starting findACME(%s)", rootFolder);
    var ACMEPath = path.join(rootFolder, acmeToolNameWithExtension);
    console.log(" ACMEPath: %s", ACMEPath);
    var allPaths = tl.find(rootFolder);
    var matchingResultsFiles = tl.match(allPaths, ACMEPath, rootFolder);
    return matchingResultsFiles[0];
}
function getACMEDownloadURL(version) {
    return "https://downloads.sourceforge.net/project/acme-crossass/win32/acme0.96.4win.zip?r=https%3A%2F%2Fsourceforge.net%2Fprojects%2Facme-crossass%2Ffiles%2Fwin32%2Facme0.96.4win.zip%2Fdownload%3Fuse_mirror%3Djaist&ts=1565237877";
    //return util.format("https://downloads.sourceforge.net/project/acme-crossass/%s/acme%swin.zip",platform, version);   
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
