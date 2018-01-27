//Storage
var path = require('path')
    ,fs = require('fs')
    ,$ = require('jquery');

    module.exports = {
      getData: dataType=>{
        var dataPath = path.join(__dirname, '/data/inmuebles.json');
        return new Promise((resolve, reject)=>{
          fs.readFile(dataPath, 'utf8', (err, readData)=>{
            if(err) reject(err)
            resolve(JSON.parse(readData))
          })
        })
      }
    }
