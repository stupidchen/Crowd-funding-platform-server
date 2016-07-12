/**
 * Created by mike on 7/10/16.
 */
"use strict";

var db = require('../dao/databaseController');
var externalController = require('./externalController');
var dataPoolController = require('./dataPoolController');
var securityUtil = require('../util/securityUtil');
var errorUtil = require('../util/errorUtil');
var tokenPool = [];

function getUserIdByToken(token) {
    if (token) return;
    return tokenPool.indexOf(token);
}

function addTokenByUserId(userId, token) {
    tokenPool[userId] = token;
}

var controller = {
    init: function (data, callback) {
        var msg = {
            err: null
        };
        
        if (data.token && data.userId) {
            addTokenByUserId(data.userId, data.token);
        }
        else {
            msg.err = errorUtil.createError(13);
        }
        callback(msg);
    },

    logout: function (data, callback) {
        var userId = getUserIdByToken(data.token);

        if (userId) {
            tokenPool[userId] = undefined;
        }
    },

    getItemList: function (data, callback) {
        var msg = {
            err: null,
            list: dataPoolController.getItemList()
        };
        
        callback(msg);
    },

    //Like item
    getLikeItemList: function (data, callback) {
        var userId = getUserIdByToken(data.token);

        var msg = {
            err: null
        };
        if (userId) {
            db.queryLikeItem(userId, function (err, result) {
                if (err) {
                    msg.err = errorUtil.createError(2, err);
                    callback(msg);
                }
                else {
                    msg.result = result;
                    callback(msg);
                }
            });
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },

    addLikeItem: function (data, callback) {
        var userId = getUserIdByToken(data.token);
        data.userId = userId;

        var msg = {};
        if (userId) {
            db.addLikeItem(data, function(err) {
                if (err) {
                    msg.err = errorUtil.createError(2, err);
                    callback(msg);
                }
                else {
                    callback(msg);
                }
            });
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },

    removeLikeItem: function (data, callback) {
        var userId = getUserIdByToken(data.token);
        data.userId = userId;

        var msg = {};
        if (userId) {
            db.removeLikeItem(data, function(err) {
                if (err) {
                    msg.err = errorUtil.createError(2, err);
                    callback(msg);
                }
                else {
                    callback(msg);
                }
            });
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },

    //Normal item
    addItem: function (data, callback) {
        var userId = getUserIdByToken(data.token);

        var msg = {};
        if (userId) {
            data.itemId = securityUtil.generateId();

            var cashUserId = securityUtil.generateId();
            var password = securityUtil.generateId();
            var payword = securityUtil.generateId();
            var cashUserData = {
                userId: cashUserId,
                password: password,
                payword: payword
            };

            externalController.addBizUser(cashUserData, function (err) {
                if (err) {
                    msg.err = err;
                    callback(msg);
                }
                else {
                    dataPoolController.addCashUser(cashUserData);
                    data.cashUserId = cashUserId;
                    data.status = 1;
                    db.addItem(data, function (err) {
                        if (err) {
                            msg.err = err;
                            callback(msg);
                        }
                        else {
                            db.addCashUsers(cashUserData, function (err) {
                                if (!err) {
                                    dataPoolController.addItem(data);
                                }
                                msg.err = err;
                                callback(msg);
                            });
                        }
                    });
                }
            });
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },

    joinItem: function (data, callback) {
        var userId = getUserIdByToken(data.token);

        var msg = {};
        if (userId) {
            db.queryItem(data, function (err, result) {
                if (err) {
                    msg.err = errorUtil.createError(2, err);
                    callback(msg);
                }
                else {
                    if (!result[0]) {
                        msg.err = errorUtil.createError(12);
                        db.joinItem(data, function (err) {
                            if (err) {
                                msg.err = errorUtil.createError(2, err);
                                callback(msg);
                            }
                            callback(msg);
                        });
                    }
                }
            });
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },
};

module.exports = controller;
