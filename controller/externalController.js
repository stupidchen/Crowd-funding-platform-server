/**
 * Created by mike on 7/11/16.
 */
"use strict";

var http = require('http');
var errorUtil = require('../util/errorUtil');
var configUtil = require('../util/configUtil');

function sendRequest(path, body, callback) {
    var options = {
        host: configUtil.external.pay.host,
        port: configUtil.external.pay.port,
        method: configUtil.external.pay.method,
        path: path,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    };
    var request = http.request(options, function (response) {
        if (response.statusCode != 200) {
            callback(errorUtil.createError(13));
        }
        else {
            var result = '';
            response.on('data', function (chunk) {
                result += chunk;
            }).on('end', function () {
                callback(null, JSON.parse(result));
            });
        }
    });
    request.end(body);
}

var controller = {
    addBizUser: function (data, callback) {
        sendRequest('/register', JSON.stringify(data), callback);
    },

    bizUserLogin: function (data, callback) {
        sendRequest('/login', JSON.stringify(data), callback);
   },
    
    bizUserTransfer: function (data, callback) {
        sendRequest('/transfer', JSON.stringify(data), callback);
    },
};

module.exports = controller;