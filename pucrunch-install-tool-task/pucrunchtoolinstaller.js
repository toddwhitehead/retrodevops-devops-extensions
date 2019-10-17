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
const toolLib = require("azure-pipelines-tool-lib/tool");
const utils = require("./utils");
tl.setResourcePath(path.join(__dirname, 'task.json'));
function configurePUCrunch() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting: configurePUCrunch");
        var version = "1.0.0";
        var pucrunchPath = yield utils.downloadPUCrunch(version);
        console.log("pucrunchPath: %s", pucrunchPath);
        // prepend the tools path. instructs the agent to prepend for future tasks
        if (!process.env['PATH'].startsWith(path.dirname(pucrunchPath))) {
            toolLib.prependPath(path.dirname(pucrunchPath));
        }
    });
}
function verifyPUCrunch() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting: pucrunch");
        console.log(tl.loc("VerifyPUCrunchInstallation"));
        var toolPath = tl.which("pucrunch", true);
        console.log("acmeToolPath: %s", toolPath);
        var acme = tl.tool(toolPath);
        acme.arg("--version");
        //return acme.exec();
        return true;
    });
}
configurePUCrunch()
    .then(() => verifyPUCrunch())
    .then(() => tl.setResult(tl.TaskResult.Succeeded, ""))
    .catch((error) => tl.setResult(tl.TaskResult.Failed, error));
