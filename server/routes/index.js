let express = require('express');
let router = express.Router();
let {readFileSync} = require('fs');
const platform = require('os').platform();

router.get('/get', function (req, res, next) {
  try {
    let log = '';
    if (platform === 'darwin') {
      log = readFileSync(`/Users/helloworld/Documents/web/logs/${req.query.filename}`).toString()
    } else if (platform === 'linux') {
      log = readFileSync(`/scripts/logs/${req.query.filename}`).toString()
    }
    res.send(log)
  } catch (e) {
    res.send(e)
  }
});

module.exports = router;
