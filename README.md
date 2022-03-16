# Steam Workshop file/item downloader
This is a simple script that downloads images, pdfs and text files from the Steam Workshop. It scans a .json file for http(s) links and tries to download everything it can find in that file.

# How to run
NodeJs needs to be installed. I'm running the script with NodeJs v12.16.1 but other versions might work just as well.

## Install
1) Clone the repo
2) run "npm install"

## Start the script
1) run "npm start"

## How to use
1) Visit the Steam Workshop page from the project of which you want to download the files. (F.e. https://steamcommunity.com/sharedfiles/filedetails/...)
2) Copy the URL of the Project
3) Go to https://steamworkshopdownloader.io/ , insert the URL and download the .zip file and extract it. There are 2 files in the .zip, the only one needed is the file named "WorkshopUpload.extracted.json".
4) If you like rename the file (the filename doesn't matter).
5) Place the file into the "/source" folder of the SteamWorkshopFileDownloader. You can place as many files as you like inside this folder. The Script will scan each of them and download all the links inside that file one after another.
6) The content will be downloaded into the "/output" folder, into a sub folder. The subfolder will be named like the "SaveName" value in the WorkshopUpload.extracted.json file.

## Further explanations
1) At the current state it assumes that the downloaded text files are .obj files. If you don't want that you have add the functionality to open the .txt file and check its content to figure out the correct type.
2) The script is a bit messy. It was quickly thrown together without any intention of readability. 
3) "How to use" step 1-5 might be automated at a later stage and replaced by copying the workshop URLs into a text file.
