var express = require('express');
var router = express.Router();
var url = require('url');
var verifyCall = require('../tools/verify');
var request = require('request-promise');
const fs = require('fs');

router.post('/create-product', function (req, res) {

    let new_product = {
        product: {
            title: req.body.title,
            body_html: req.body.body_html,
            vendor: req.body.vendor,
            product_type: req.body.product_type,
            images:req.body.images,
            tags: req.body.tags
        }
    };
    let api_key = process.env.API_KEY;
    let id = req.query.id;
    let url = 'https://' + process.env.SHOP_URL + '/admin/products.json';

    let options = {
        method: 'POST',
        uri: url,
        json: true,
        resolveWithFullResponse: true,//added this to view status code
        headers: {
            'X-Shopify-Access-Token': api_key,
            'content-type': 'application/json'
        },
        body: new_product//pass new product object - NEW - request-promise problably updated
    };

    request.post(options)
    .then(function (response) {
        // Asynchronously delete a file
        fs.unlink('/tmp/tmp_' + id + '.jpg', (err) => {
            if (err) {
            // Handle specific error if any
                if (err.code === 'ENOENT') {
                    console.error('File does not exist.');
                } else {
                    throw err;
            }
            } else {
                console.log('File deleted!');
            }
        });
        fs.unlink('/tmp/tmp_' + id + '_1.jpg', (err) => {
            if (err) {
            // Handle specific error if any
                if (err.code === 'ENOENT') {
                    console.error('File does not exist.');
                } else {
                    throw err;
            }
            } else {
                console.log('File deleted!');
            }
        });
        res.json(response);
    })
    .catch(function (err) {
        console.log(err);
        fs.unlink('/tmp/tmp_' + id + '.jpg', (err) => {
            if (err) {
            // Handle specific error if any
                if (err.code === 'ENOENT') {
                    console.error('File does not exist.');
                } else {
                    throw err;
            }
            } else {
                console.log('File deleted!');
            }
        });
        fs.unlink('/tmp/tmp_' + id + '_1.jpg', (err) => {
            if (err) {
            // Handle specific error if any
                if (err.code === 'ENOENT') {
                    console.error('File does not exist.');
                } else {
                    throw err;
            }
            } else {
                console.log('File deleted!');
            }
        });
        res.json(err);
    });
});

module.exports = router;