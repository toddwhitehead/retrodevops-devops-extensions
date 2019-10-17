import tl = require('azure-pipelines-task-lib/task');
import path = require('path');

tl.setResourcePath(path.join(__dirname, "task.json"));
setConsoleCodePage(); 

var sourceFilename:string; 
var otherCommands:string; 
var destinationFilename:string;

    
    // Setup the paramters and values needed
    async function configurePUCrunch() {
        console.log("-- Starting: configureACME");

        sourceFilename = tl.getPathInput("sourceFilename",true,true);
        destinationFilename = tl.getInput("destinationFilename",true);
        otherCommands = tl.getInput("otherCommands",false);
    }

    async function compressProgram() {
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

    configurePUCrunch()
        .then(() => compressProgram())
        .then(() => tl.setResult(tl.TaskResult.Succeeded, ""))
        .catch((error) => tl.setResult(tl.TaskResult.Failed, error));

 

   

   
  
