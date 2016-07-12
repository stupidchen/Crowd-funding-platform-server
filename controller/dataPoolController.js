/**
 * Created by mike on 7/12/16.
 */
"use strict";

var db = require('../dao/databaseController');
var externalController = require('./externalController');
var errorUtil = require('../util/errorUtil');

var controller = {
    itemPool: [],
    
    cashUserPool: [],

    itemUpdated: 0,
    
    init: function (callback) {
        db.queryItem(data, function (err, result) {
            if (err) {
                var err = errorUtil.createError(2, err);
                callback(err);
            }
            else {
                controller.itemPool = result;
            }
        });
        db.queryCashUser(data, function (err, result) {
            if (err) {
                var err = errorUtil.createError(2, err);
                callback(err);
            }
            else {
                controller.cashUserPool = result;
            }
        });
    },

    getItemList: function () {
        return itemPool;
    },

    addItem: function (item) {
        if (!itemPool[item.itemId]) {
            itemPool[item.itemId] = item;
        }
    },

    addCashUser: function (user) {
        if (!this.cashUserPool[user.userId]) {
            this.cashUserPool[user.userId] = user;
        }
    },
    
    itemStop: function (item) {
        itemPool[item.itemId].status = 0;
        var msg = {
            err: null
        };
        db.queryJoiner(item, function (err, result) {
            if (err) {
                msg.err = errorUtil.createError(2, err);
                callback(msg);
            }
            else {
                result.forEach(function (pair) {
                    externalController.bizUserLogin(controller.cashUserPool[item.cashUserId], function (err, result) {
                        var transferRequest = {
                            token: result.token,
                            toUserId: pair.userId,
                            amount: pair.money
                        };
                        externalController.bizUserTransfer(transferRequest, function (err) {
                            if (err) {
                                msg.err = errorUtil.createError(13, err);
                            }
                            callback(msg);
                        });
                    });
                }, callback(msg));
            }
        });
    },

    itemSuccess: function (item) {
        var amount = item.moneySum;
        var ownerId = item.userId;
        var cashUserId = item.cashUserId;
        externalController.bizUserLogin(controller.cashUserPool[cashUserId], function (err, result) {
            var transferRequest = {
                token: result.token,
                toUserId: ownerId,
                amount: amount
            };
            externalController.bizUserTransfer(transferRequest, function (err) {
                if (err) {
                    msg.err = errorUtil.createError(13, err);
                }
                else {
                   controller.cashUserPool[cashUserId].status = 0;
                }
                callback(msg);
            });
        });
    },
    
    checkAllItems: function (callback) {
        itemPool.forEach(function (item) {
            controller.checkItem(item);
        }, callback);
    },
    
    checkItem: function (item, callback) {
        var currentTime = Date.now();
        if (item.sum >= item.moneyGoal) {
            this.itemSuccess(itemId);
        }

        if (item.endTime - currentTime <= 0) {
            this.itemStop(itemId);
        }
    },
};

module.exports = controller;