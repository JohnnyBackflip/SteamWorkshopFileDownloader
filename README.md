# SteamWorkshopFileDownloader
This is a simple script that downloads images, pdfs and text files from Steam Workshop .json files. It scans the .json for http(s) links and downloads everything it finds in that file.

# How to run
You need NodeJs to be installed. I'm running the script with NodeJs v12.16.1.

## Install
1) Clone the repo
2) run "npm install"

## Start the script
1) run "npm start"

## How to use
1) Visit the Steam Workshop page from the project of which you want to download the files. (https://steamcommunity.com/sharedfiles/filedetails/...)
2) Copy the URL of the Project
3) go to https://steamworkshopdownloader.io/ , insert the URL and download the projects .json files. Extract the .zip. There are 2 files in the .zip, the only one needed is the file named "WorkshopUpload.extracted.json".
4) If you like rename the file (the filename doesn't matter).
5) Place the file into the "/source" folder of the SteamWorkshopFileDownloader. You can place as many files as you like inside this folder. The Script will scan each of them and download all the links inside that file one after another.
6) The content will be downloaded into the "/output" folder, into a sub folder. The subfolder will be named like the "SaveName" value in the WorkshopUpload.extracted.json file.

## Things to remember
1) At the current state it assumes that the downloaded text files are .obj files.
2) The script is a bit messy. It was quickly thrown together without any intention of readability. 
