/**
 * Created by kojunghyun on 14. 12. 18..
 */
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
    var gatePath = path.join(__dirname, '../public', 'main.html');
    console.log("gatePath:",gatePath);
    res.sendFile(gatePath);
});

module.exports = router;