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
function configureACME() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting: configureACME");
        var version = tl.getInput("acmeVersion", true);
        console.log("version: %s", version);
        var acmePath = yield utils.downloadACME(version);
        console.log("acmePath: %s", acmePath);
        // prepend the tools path. instructs the agent to prepend for future tasks
        if (!process.env['PATH'].startsWith(path.dirname(acmePath))) {
            toolLib.prependPath(path.dirname(acmePath));
        }
    });
}
function verifyACME() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting: verifyACME");
        console.log(tl.loc("VerifyACMEInstallation"));
        var acmeToolPath = tl.which("acme", true);
        console.log("acmeToolPath: %s", acmeToolPath);
        var acme = tl.tool(acmeToolPath);
        acme.arg("--version");
        return acme.exec();
    });
}
configureACME()
    .then(() => verifyACME())
    .then(() => tl.setResult(tl.TaskResult.Succeeded, ""))
    .catch((error) => tl.setResult(tl.TaskResult.Failed, error));
