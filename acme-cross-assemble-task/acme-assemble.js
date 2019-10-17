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
tl.setResourcePath(path.join(__dirname, "task.json"));
setConsoleCodePage();
var sourceFile;
var sourcePath;
var targetCPU;
var fileFormat;
var otherCommands;
var verbosityLevel;
var outputFilename;
var outputDirectory;
var compressOutput;
// Setup the paramters and values needed
function configureACME() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("-- Starting: configureACME");
        sourcePath = tl.getPathInput("sourcePath", true, true);
        sourceFile = tl.getInput("sourceFile", true);
        targetCPU = tl.getInput("targetCPU", true);
        fileFormat = tl.getInput("fileFormat", true);
        otherCommands = tl.getInput("otherCommands", false);
        verbosityLevel = tl.getInput("verbosityLevel", false);
        outputFilename = tl.getInput("outputFilename", true);
        outputDirectory = tl.getVariable("Build.ArtifactStagingDirectory");
        compressOutput = tl.getBoolInput("Build.compressOutput");
    });
}
function assembleACME() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("-- Starting: assembleACME");
        var acmePath = tl.which("acme", true);
        console.log("acmeToolPath: %s", acmePath);
        var acmeTool = tl.tool(acmePath);
        tl.pushd(sourcePath);
        console.log("--format: %s", fileFormat);
        acmeTool.arg(["--format", fileFormat]);
        console.log("--cpu: %s", targetCPU);
        acmeTool.arg(["--cpu", targetCPU]);
        console.log("-v: %s", verbosityLevel);
        acmeTool.arg("-v" + verbosityLevel);
        var fulloutputPath = path.join(outputDirectory, outputFilename);
        console.log("--outfile: %s", fulloutputPath);
        acmeTool.arg(["--outfile", fulloutputPath]);
        console.log("-otherCommands: %s", otherCommands);
        acmeTool.arg(otherCommands);
        console.log("soureFile: %s", sourceFile);
        acmeTool.arg(sourceFile);
        return acmeTool.exec().then(() => tl.popd());
    });
}
function setConsoleCodePage() {
    return __awaiter(this, void 0, void 0, function* () {
        // set the console code page to "UTF-8"
        /*
        if (tl.osType() === 'Windows_NT') {
            try {
                tl.execSync(path.resolve(process.env.windir, "system32", "chcp.com"), ["65001"]);
            }
            catch (ex) {
                tl.warning(tl.loc("CouldNotSetCodePaging", JSON.stringify(ex)))
            }
        }
        */
    });
}
configureACME()
    .then(() => assembleACME())
    .then(() => tl.setResult(tl.TaskResult.Succeeded, ""))
    .catch((error) => tl.setResult(tl.TaskResult.Failed, error));
