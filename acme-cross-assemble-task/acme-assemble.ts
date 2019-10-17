import tl = require('azure-pipelines-task-lib/task');
import path = require('path');

tl.setResourcePath(path.join(__dirname, "task.json"));
setConsoleCodePage(); 

var sourceFile:string; 
var sourcePath:string;
var targetCPU:string; 
var fileFormat:string; 
var otherCommands:string; 
var verbosityLevel:string;
var outputFilename:string;
var outputDirectory:string;
var compressOutput:boolean;
    
    // Setup the paramters and values needed
    async function configureACME() {
        console.log("-- Starting: configureACME");

        sourcePath = tl.getPathInput("sourcePath",true,true);
        sourceFile = tl.getInput("sourceFile",true);
        targetCPU = tl.getInput("targetCPU", true);
        fileFormat = tl.getInput("fileFormat",true);
        otherCommands = tl.getInput("otherCommands",false);
        verbosityLevel = tl.getInput("verbosityLevel",false);
        outputFilename = tl.getInput("outputFilename",true);
        outputDirectory = tl.getVariable("Build.ArtifactStagingDirectory");
        compressOutput = tl.getBoolInput("Build.compressOutput");
    }

    async function assembleACME() {
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
    }
    
    async function  setConsoleCodePage() {
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
       
    }

    configureACME()
        .then(() => assembleACME())
        .then(() => tl.setResult(tl.TaskResult.Succeeded, ""))
        .catch((error) => tl.setResult(tl.TaskResult.Failed, error));

 

   

   
  
