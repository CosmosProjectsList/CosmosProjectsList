const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const AWS = require('aws-sdk');
const S3H = require('./storage/S3Helper');

const app = express();
const port = 6000;
access_token=""
confirmedFiles = {}
confirmedFilesContent = {}
isBusy = false;

const S3Helper = new S3H();



const fileListRefresh = () => {

  if(isBusy)
    return;

  isBusy = true;
  confirmedFileListRequest="https://api.github.com/repos/CosmosProjectsList/ProjectsRegistry/contents/confirmed" + access_token;
  axios.get(confirmedFileListRequest).then(async res => { //fetch file list from github
      var newList = {}
      //console.log(`Found ${res.data.length} project files!`)
      for(var i = 0; i < res.data.length; i++){
        file = res.data[i]
        var editLink = file["_links"]["html"].replace("/blob/","/edit/");
        var likeTarget = `hits/summary/${file.name.replace(".json", "")}-like.json`;
        var socialTarget = `hits/summary/${file.name.replace(".json", "")}-social.json`;
        var pageTarget = `hits/summary/${file.name.replace(".json", "")}-page.json`;
        var infoTarget = `hits/summary/${file.name.replace(".json", "")}-info.json`;

        var likes = 0;
        var social = 0;
        var page = 0;
        var info = 0;
        try
        {
          var tLikesExist = S3Helper.FileExists(likeTarget);
          var tSocialExist = S3Helper.FileExists(socialTarget);
          var tPageExist = S3Helper.FileExists(pageTarget);
          var tInfoExist = S3Helper.FileExists(infoTarget);

          if(await tLikesExist) {
            likes = ((await S3Helper.DownloadJson(likeTarget)) || { "Count": 0  }).Count;
          }
          if(await tSocialExist) {
            social = ((await S3Helper.DownloadJson(socialTarget)) || { "Count": 0  }).Count;
          }
          if(await tPageExist) {
            page = ((await S3Helper.DownloadJson(pageTarget)) || { "Count": 0  }).Count;
          }
          if(await tInfoExist) {
            info = ((await S3Helper.DownloadJson(infoTarget)) || { "Count": 0  }).Count;
          }
        } catch { }

        newList[file.name] = {
          "name": file.name,
          "size": file.size,
          "sha": file.sha,
          "download_url": file.download_url,
          "edit": editLink,
          "like-hits": likes,
          "social-hits": social,
          "page-hits": page,
          "info-hits": info
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
          console.log(`File ${name} was removed (${oldFile.sha})`);
          continue;
        }

        if(oldFile.sha != newFile.sha || 
          oldFile["like-hits"] != newFile["like-hits"] || 
          oldFile["social-hits"] != newFile["social-hits"] || 
          oldFile["page-hits"] != newFile["page-hits"] ||
          oldFile["info-hits"] != newFile["info-hits"]) {
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

      isBusy = false;
    }).catch(err => {
      console.log(err);
      console.log("Failed To Fetch Confirmed Projects File List");
      isBusy = false;
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


app.get('/api/hit', async (req, res) => {
  var date = new Date();
  var host = (req.headers.host || 'undefined').replace("/", "").replace(":", "").replace("\\", "");
  var tartget = (req.query.target || 'undefined').replace("/", "").replace(":", "").replace("\\", "");

  var tartgetName = `hits/summary/${tartget}.json`;
  var hostName = `hits/targets/${tartget}/${host}.json`;

  var like = {
    "Host": req.headers.host,
    "Date": date.toUTCString(),
    "Count": 1
  }

  var hit = {
    "Target": req.query.target,
    "Date": date.toUTCString(),
    "Count": 1
  }

  var canLike = true;

    if(await S3Helper.FileExists(hostName)){
      var oldLike = (await S3Helper.DownloadJson(hostName)) || { "Host": host  };
      var lastLike = Date.parse(date.toUTCString()) - Date.parse(oldLike.Date)
      var nextLike = 1000*60*60*24 - lastLike;

      if(nextLike > 0)
        canLike = false;

      if(canLike) {
        console.log(`SUCCESS Hit from '${host}' reached '${tartget}', elapsed: ${lastLike/1000}s since last hit.`)
        oldLike.Count = (oldLike.Count || 1) + 1; 
        oldLike.Date = date.toUTCString();
        like = oldLike;
      }
      else {
        var msg = `FAILED Hit from '${host}'already reached '${tartget}' ${nextLike/1000}s of jail time remaining.`;
        console.log(msg)
        res.status(500);
        res.send(msg);
        return;
      }
    }

    if((await S3Helper.FileExists(tartgetName)))
    {
      var oldHit = (await S3Helper.DownloadJson(tartgetName)) || { "Target": target  };
      oldHit.Count = (oldHit.Count || 1) + 1; 
      oldHit.Date = date.toUTCString();
      hit = oldHit;
    }

    await S3Helper.UploadJson(hostName, like);
    await S3Helper.UploadJson(tartgetName, hit);


    var name = req.query.target.split("-")[0];
    var type = req.query.target.split("-")[1];
    confirmedFiles[`${name}.json`][`${type}-hits`] = hit.Count;
    confirmedFiles[`${name}.json`].update = true;
    res.send(hit);
});


/*app.get('*', (req, res) => {
  res.send("Welcome To Ecosystem Lists API Server");
});*/

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



