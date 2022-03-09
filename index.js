const fs = require('fs');
const path = require('path');
const http = require('follow-redirects').http;
const https = require('follow-redirects').https;
var async = require("async");
var mmm = require('mmmagic'),

Magic = mmm.Magic;
var magic = new Magic(mmm.MAGIC_MIME_TYPE);



const terminalOverwrite = require('terminal-overwrite');

var sourceFolderName = "./source/"
var outputFolderName = "./output/"


var imageFolder = "/img"
var objectFolder = "/obj"
var pdfFolder = "/pdf"


console.log("Starting file download...")

fs.readdir("./source", function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    downloadGameFiles(outputFolderName, files);

});




function downloadGameFiles(foldername, files){
    
    if(files.length == 0){
        console.log("Done downloading.")
        return;
    }    

    var sourceFile = sourceFolderName+files.pop();

    var listOfAllLinksInJson = []
    var nameOfGame = sourceFile;

    function changeFilename(filename){
            //console.log("changing filename...")
            magic.detectFile(filename, function(err, result) {
                      try{

                          if (err) throw err;
                          
                            //console.log(filename +" is "+result);
                            var typeFound = 0;

                            //to sort results in different folders
                            var withoutLastChunk = filename.slice(0, filename.lastIndexOf("/"));
                            var lastChunk = filename.slice(filename.lastIndexOf("/"));

                            if(result.includes("jpeg")){
                                if (!fs.existsSync(withoutLastChunk+imageFolder)){
                                        fs.mkdirSync(withoutLastChunk+imageFolder, { recursive: true });
                                }
                                //console.log("image is a jpeg")
                                fs.rename(filename, withoutLastChunk+imageFolder+lastChunk+".jpg", function(err) {
                                    if ( err ) console.log('ERROR: ' + err);
                                });
                                typeFound = "jpg";
                            }

                            if(result.includes("pdf")){
                                if (!fs.existsSync(withoutLastChunk+pdfFolder)){
                                        fs.mkdirSync(withoutLastChunk+pdfFolder, { recursive: true });
                                }
                                //console.log("image is a pdf")
                                fs.rename(filename, withoutLastChunk+pdfFolder+lastChunk+".pdf", function(err) {
                                    if ( err ) console.log('ERROR: ' + err);
                                });
                                typeFound = "pdf";
                            }

                            if(result.includes("png")){
                                if (!fs.existsSync(withoutLastChunk+imageFolder)){
                                        fs.mkdirSync(withoutLastChunk+imageFolder, { recursive: true });
                                }
                                fs.rename(filename, withoutLastChunk+imageFolder+lastChunk+".png", function(err) {
                                    if ( err ) console.log('ERROR: ' + err);
                                });
                                typeFound = "png";
                            }

                            if(result.includes("text/plain")){
                                if (!fs.existsSync(withoutLastChunk+objectFolder)){
                                        fs.mkdirSync(withoutLastChunk+objectFolder, { recursive: true });
                                }
                                fs.rename(filename, withoutLastChunk+objectFolder+lastChunk+".obj", function(err) {
                                    if ( err ) console.log('ERROR: ' + err);
                                });
                                typeFound = "obj";
                            }



                            
                            //remove id the file is not a jpg png or pdf
                            if(typeFound == 0){
                                //console.log("type is " + result)
                                fs.unlink(filename, function(err) {
                                    if(err && err.code == 'ENOENT') {
                                        // file doens't exist
                                        console.info("File doesn't exist, won't remove it.");
                                    } else if (err) {
                                        // other errors, e.g. maybe we don't have enough permission
                                        console.error("Error occurred while trying to remove file");
                                    } else {
                                       //console.info(`removed ` + filename + ",type was " + result);
                                    }
                                });
                            }else{
                                //console.log("type is " + typeFound)
                            }
                        }catch(error){
                            //...        
                        }
        
                      // output on Windows with 32-bit node:
                      //    application/x-dosexec
                  });
    }

    /**
     * Downloads file from remote HTTP[S] host and puts its contents to the
     * specified location.
     */
    async function download(url, filePath, changeFilenameFunctionRef) {
      const proto = !url.charAt(4).localeCompare('s') ? https : http;
        //console.log("url is " + url);
        //console.log(!url.charAt(4).localeCompare('s'))

      return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        let fileInfo = null;

        const request = proto.get(url, response => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
            return;
          }

          fileInfo = {
            mime: response.headers['content-type'],
            size: parseInt(response.headers['content-length'], 10),
          };

            // read all file and pipe it (write it) to the hash object
            response.pipe(file);

            return new Promise(function(resolve, reject) {
                response.on('end', () => {changeFilenameFunctionRef(filePath)});
                file.on('error',  () => {console.log("error writing file"); file.close()});
            });

            

        });

        // The destination stream is ended by the time it's called
        file.on('finish', () => resolve(fileInfo));

        request.on('error', err => {
          fs.unlink(filePath, () => reject(err));
        });

        file.on('error', err => {
          fs.unlink(filePath, () => reject(err));
        });

        request.end();
      });
    }


    //called with every property and its value
    function process(key,value) {
        //here we download
        //console.log(key + " : "+value);
        if(key == "SaveName"){
                nameOfGame = value;
        }

        if(!value){
            return;        
        }

        if(value.substring){
            if(value.substring(0, 4) == 'http'){
                listOfAllLinksInJson.push(value);
                
            }
            
        }

    }


    //traverse
    function traverse(o,func) {
        for (var i in o) {
            func.apply(this,[i,o[i]]);  
            if (o[i] !== null && typeof(o[i])=="object") {
                //going one step down in the object tree!!
                traverse(o[i],func);
            }
        }
    }


    //read the file
    fs.readFile(sourceFile, 'utf8', async function (err,data) {
      if (err) {
        return console.log(err);
      }

       //parse
       try {
        var parsedData = JSON.parse(data);
        } catch (error) {
          console.error(error);
          return;
        }



       //traverse json to get the http data in a list
       traverse(parsedData,process);
       //make that this list has only unique entries
       const uniqueLinksList = [ ...new Set(listOfAllLinksInJson)] 
       console.log()
       //await download(uniqueLinksList[1],foldername+'2');
       //iterate over the list and download all files

        var dir = outputFolderName + nameOfGame ;

        if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
        }


        var errorsWhenDownloading = false;
        for(var i = 0;i < uniqueLinksList.length;i++){
            terminalOverwrite("Downloading " + nameOfGame + "... " +(i+1)+ "/" + uniqueLinksList.length);
            try {

              await download(uniqueLinksList[i],dir+"/"+i,changeFilename)
             
            } catch (error) {
                            //console.error("removing file from " + uniqueLinksList[i]);
                            //console.log(error)
                            errorsWhenDownloading = true;
                            try {
                            fs.unlink(dir+'/'+i, function(err) {
                                if(err && err.code == 'ENOENT') {
                                    // file doens't exist
                                    //console.info("File '" + dir +'/'+i +"' doesn't exist, won't remove it.");
                                } else if (err) {
                                    // other errors, e.g. maybe we don't have enough permission
                                    //console.error("Error occurred while trying to remove file");
                                } else {

                                //console.log(error)

                                }
                            });
                                
                            }catch (error) {
                                //console.log(error)
                            }


              // expected output: ReferenceError: nonExistentFunction is not defined
              // Note - error messages will vary depending on browser
            }

            


        }
        if(errorsWhenDownloading){
                console.log("Error: Couldn't download all files for " + nameOfGame + ".")    
        }

       downloadGameFiles(outputFolderName, files);//do all files recoursively

    });

}


