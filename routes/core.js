/**
 * Created by mike on 7/10/16.
 */
"use strict";

var express = require('express');
var router = express.Router();
var controller = require('../controller/globalController');
var dataPoolController = require('../controller/dataPoolController');
var dataUtil = require('../util/dataUtil');
var configUtil = require('../util/configUtil');

dataUtil.addMySqlFormat();

dataPoolController.init(function (err) {
    if (!err) {
        
    }
    else {
        console.warn('Server initialize failed!');
    }
});

router.post(configUtil.system.interface.init, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.init(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.logout, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.logout(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.getItemInfo, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.getItemInfo(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.getItems, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.getItemList(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.getLikeItems, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.getLikeItemList(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.isLikeItem, function (req, res, next) {
    var body = requestOpener(req.body);
    controller.isLikeItem(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.changeLikeItem, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.changeLikeItem(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.addItem, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.addItem(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.joinItem, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.joinItem(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.getOwnItems, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.getOwnItems(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

router.post(configUtil.system.interface.getJoinItems, function (req, res, next) {
    var body = requestOpener(req.body); 
    controller.getJoinItems(body, function (err, result) {
        sendMessageByJson(res, messageWrapper(err, result));
    });
});

function requestOpener(data) {
    if (data.data) {
        var token = data.token;
        data = data.data;
        data.token = token;
    }
    return data;
}

function messageWrapper(err, result) {
    var msg = {
        err: null,
        result: null
    }
    
    if (err) {
        msg.err = err;
    }
    else {
        msg.result = result;
    }
    
    return msg; 
}

function sendMessageByJson(response, message) {
//    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(message));
}

module.exports = router;
