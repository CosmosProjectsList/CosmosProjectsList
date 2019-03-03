const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
access_token=""
confirmedFiles = {}
confirmedFilesContent = {}

//github_cosmosprojectslist_access_token

const fileListRefresh = () => {
  confirmedFileListRequest="https://api.github.com/repos/CosmosProjectsList/ProjectsRegistry/contents/confirmed" + access_token;
  axios.get(confirmedFileListRequest).then(res => { //fetch file list from github
      var newList = {}
      for(var i = 0; i < res.data.length; i++){
        file = res.data[i]
        newList[file.name] = {
          "name": file.name,
          "size": file.size,
          "sha": file.sha,
          "download_url": file.download_url
        }
      }

      var oldKeys = Object.keys(confirmedFiles);
      var newKeys = Object.keys(newList);

      for(var i = 0; i < oldKeys.length; i++){
        var name = oldKeys[i];
        var oldFile = confirmedFiles[name];
        var newFile = newList[name];
        if(!newFile) { //delete keys not present in the old list
          delete confirmedFiles[name]
          continue;
        }

        if(oldFile.sha != newFile.sha) {
          confirmedFiles[name] = newFile;
          confirmedFiles[name].update = true;
          console.log(`File ${name} was updated (${newFile.sha})`);
        }
      }

      for(var i = 0; i < newKeys.length; i++){
        var name = newKeys[i];
        var newFile = newList[name];
        if(!confirmedFiles[name]) { //add new keys
          confirmedFiles[name] = newFile
          confirmedFiles[name].update = true
          console.log(`New File ${name} was found (${newFile.sha})`);
        }
      }
    }).catch(err => {
      console.log(err);
      console.log("Failed To Fetch Confirmed Projects File List");
    })
};

const filesContentRefresh = () => {


}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/healthcheck', (req, res) => {
  res.send("OK");
});


//https://api.github.com/repos/CosmosProjectsList/ProjectsRegistry

app.get('/api/confirmedProjects', (req, res) => {
  res.json(confirmedFiles);
});

app.get('/api/confirmedProjectsContent', (req, res) => {
  res.json(confirmedFiles);
});

app.get('*', (req, res) => {
  res.send("Welcome To Ecosystem Lists API Server");
});

app.listen(port, () => console.log(`Listening on port ${port}`));

if(process.env.github_cosmosprojectslist_access_token){
  access_token="?access_token=" + process.env.github_cosmosprojectslist_access_token;
  console.log("Access Token was Found");
  setInterval(fileListRefresh, 5000);
}
else
{
  console.log("Access Token was NOT Found");
  setInterval(fileListRefresh, 120000);
}

setInterval(filesContentRefresh, 120000);



