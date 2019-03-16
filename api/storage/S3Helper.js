
const AWS = require('aws-sdk');
const fs = require('fs');



module.exports = class S3Helper {
    constructor() {
        var defaultCredentialsPaths = [ 
            "K:\\local\\AWS\\default-credentials.json",
            "/K/local/AWS/default-credentials.json" 
          ];
          
          //LOCALHOST ONLY
          for(var i = 0; i < defaultCredentialsPaths.length; i++){
            var credFile = defaultCredentialsPaths[i];
            if (fs.existsSync(credFile)) {
              AWS.config.loadFromPath(credFile);
              break;
            }
          }

          this.s3 = new AWS.S3();
      }

    async UploadJson(name, content) {
        const params = {
            Bucket: 'cosmos-projects',
            Key: name,
            Body: JSON.stringify(content, null, 2),
            ContentType: 'application/json'
        };
        
        var result =  await this.s3.upload(params).promise();
        //console.log(`Uploaded '${name}' to '${result.Location}'`)
      }

     async DownloadJson(name) {
        const params = {
            Bucket: 'cosmos-projects',
            Key: name
        };
        
        var response = await this.s3.getObject(params).promise().then(result => {
            //console.log(`Downloaded '${name}' ('${result.ContentLength}')`)
            return result.Body.toString('utf8');
        })

        return JSON.parse(response);
      }
      
      async FileExists(name) {
        var params = {
            Bucket: 'cosmos-projects',
            Key: name
        };

        try
        {
            var r = await this.s3.headObject(params).promise();
            return true;
        }
        catch(err)
        {
            if((err || {}).code === 'NotFound')
                return false;
            
            return undefined;
        }
    }
  }






