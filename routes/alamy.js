var express = require('express');
var router = express.Router();
var request = require('request-promise');
const fs = require('fs');
const resize = require('./resize');

router.get('/', function (req, res, next) {
    // let shop = req.query.shop;
    res.render('alamy');
    // res.render('app', { shop: shop });
});
router.get('/getacesstoken', function (req, res) {
    let str = process.env.ALAMY_CLIENT + ":"+ process.env.ALAMY_KEY;
    // let auth = window.btoa(str);
    let auth = Buffer.from(str, 'utf8').toString('base64');

    let url = 'https://edge-api-production.auth.eu-west-1.amazoncognito.com/oauth2/token';
    
    let options = {
        method: 'POST',
        uri: url,
        json: true,
        resolveWithFullResponse: true,//added this to view status code
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            Authorization: 'Basic ' + auth
        },
        form: {grant_type: 'client_credentials', scope: ''}
    };

    request.post(options)
        .then(function (response) {
            if (response.statusCode == 201) {
                res.json(response);
            } else {
                res.json(response);
            }

        })
        .catch(function (err) {
            console.log(err);
            res.json(err);
        });
});
router.get('/searchitem',function(req,res){
    let str = req.query.str;
    let token = req.query.token;
    let url = 'https://api.alamy.com/v3/search?q=' + str;
    let options = {
        method: 'GET',
        uri: url,
        json: true,
        resolveWithFullResponse: true,//added this to view status code
        headers: {
            Accept: 'application/json',
            Authorization: token
        },
    };

    request.get(options)
        .then(function (response) {
            if (response.statusCode == 201) {
                res.json(response);
            } else {
                res.json(response);
            }

        })
        .catch(function (err) {
            console.log(err);
            res.json(err);
        });

});
router.get('/getiteminfo', function (req, res) {
    let imgid = req.query.imgid;
    let token = req.query.token;
    let url = 'https://api.alamy.com/v3/item/' + imgid;

    let options = {
        method: 'GET',
        uri: url,
        json: true,
        resolveWithFullResponse: true,//added this to view status code
        headers: {
            Accept: 'application/json',
            Authorization: token
        },
    };

    request.get(options)
        .then(function (response) {
            if (response.statusCode == 201) {
                res.json(response);
            } else {
                res.json(response);
            }

        })
        .catch(function (err) {
            console.log(err);
            res.json(err);
        });


});

router.get('/downloaditem', function (req, res) {
    let token = req.query.token;
    let url = req.query.url;
    let id = req.query.id;

    let options = {
        method: 'GET',
        uri: url,
        json: true,
        resolveWithFullResponse: true,//added this to view status code
        headers: {
            Accept: 'application/json',
            Authorization: token
        },
    };

    request.get(options)
    .then(async function (response) {
        var download = function(uri, filename, callback){
            request.head(uri, function(err, res, body){            
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };            
        download(response.body.url, '/tmp/tmp_'+ id +'.jpg', async function(){
            console.log('done');
            await resize(id);
            res.json(response);
        });
    })
    .catch(function (err) {
        console.log(err);
        res.json(err);
    });
});

module.exports = router;