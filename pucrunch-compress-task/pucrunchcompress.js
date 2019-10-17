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
var sourceFilename;
var otherCommands;
var destinationFilename;
// Setup the paramters and values needed
function configurePUCrunch() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("-- Starting: configureACME");
        sourceFilename = tl.getPathInput("sourceFilename", true, true);
        destinationFilename = tl.getInput("destinationFilename", true);
        otherCommands = tl.getInput("otherCommands", false);
    });
}
function compressProgram() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("-- Starting: compressProgram");
        var toolPath = tl.which("pucrunch", true);
        console.log("toolPath: %s", toolPath);
        var pucrunchTool = tl.tool(toolPath);
        console.log("sourceFilename: %s", sourceFilename);
        console.log("destinationFilename: %s", destinationFilename);
        pucrunchTool.arg(sourceFilename);
        pucrunchTool.arg(destinationFilename);
        //pucrunchTool.arg(["--outfile", fulloutputPath]);  
        //console.log("-otherCommands: %s", otherCommands);
        pucrunchTool.arg(otherCommands);
        return pucrunchTool.exec();
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
configurePUCrunch()
    .then(() => compressProgram())
    .then(() => tl.setResult(tl.TaskResult.Succeeded, ""))
    .catch((error) => tl.setResult(tl.TaskResult.Failed, error));
