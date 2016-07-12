/**
 * Created by mike on 7/11/16.
 */

var http = require('http');
var errorUtil = require('../util/errorUtil');
var options = {
    host: 'localhost',
    port: '3000',
    method: 'POST',
    headers: headers
};

function sendRequest(options, callback) {
    http.request(options, function (response) {
        if (response.statusCode != 200) {
            callback(errorUtil.createError(11, response));
        }
        else {
            callback(JSON.parse(response.body));
        }
    });
}

var controller = {
    addBizUser: function (data, callback) {
        options.path = '/register';
        options.body = JSON.stringify(data);
        sendRequest(options, callback);
    },

    bizUserLogin: function (data, callback) {
        options.path = '/login';
        options.body = JSON.stringify(data);
        sendRequest(options, callback);
   },
    
    bizUserTransfer: function (data, callback) {
        options.path = '/transfer';
        options.body = JSON.stringify(data);
        sendRequest(options, callback);
    },
};

module.exports = controller;