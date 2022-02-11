let express = require('express');
let router = express.Router();
let {readFileSync} = require('fs');
const fs = require("fs");
const platform = require('os').platform();

let base = ''
if (platform === 'darwin') {
  base = '/Users/helloworld/Downloads/logs/'
} else if (platform === 'linux') {
  base = '/scripts/logs/'
}

router.get('/get', function (req, res) {
  try {
    let log = readFileSync(`${base}${req.query.filename}`).toString()
    res.send(log)
  } catch (e) {
    res.send(e)
  }
});

router.get('/dir', function (req, res) {
  let dir = req.query.dir || ''
  let dirs = fs.readdirSync(base + dir)
  dirs = dirs.filter(dir => {
    return dir.match(/(log|-)/)
  })
  let files = {}
  for (let dirName of dirs) {
    files[dirName] =  getDirFile(dirName)
  }
  res.send(files)
});

function getDirFile(dir) {
  try {
    let dirs = fs.readdirSync(base + dir)
    dirs = dirs.filter(dir => {
      return dir.match(/(log|-)/)
    })
    return dirs
  } catch (e) {
    return []
  }
}


module.exports = router;
