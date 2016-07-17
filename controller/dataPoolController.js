/**
 * Created by mike on 7/12/16.
 */
"use strict";

var db = require('../dao/databaseController');
var externalController = require('./externalController');
var errorUtil = require('../util/errorUtil');
var configUtil = require('../util/configUtil');

var controller = {
    itemPool: [],
    
    cashUserPool: [],

    init: function (callback) {
        var checkInterval = configUtil.system.checkerInterval;
        
        controller.itemPool = [];
        controller.cashUserPool = [];
        db.queryItem('', function (err, result) {
            if (err) {
                var err = errorUtil.createError(2, err);
                callback(err);
            }
            else {
                controller.itemPool = result;
                db.queryCashUser('', function (err, result) {
                    if (err) {
                        var err = errorUtil.createError(2, err);
                        callback(err);
                    }
                    else {
                        controller.cashUserPool = result;
                        controller.checkAllItems();
                        setInterval(controller.checkAllItems, checkInterval);
                    }
                });
            }
        });
    },
    
    findItem: function (itemId) {
        for (var i = 0; i < controller.itemPool.length; i++) {
            if (controller.itemPool[i].itemId === itemId) return controller.itemPool[i];
        }
        return null;
    },

    findCashUser: function (cashUserId) {
        for (var i = 0; i < controller.cashUserPool.length; i++) {
            if (controller.cashUserPool[i].userId === cashUserId) return controller.cashUserPool[i];
        }
        return null;
    },
    
    getItemInfo: function (item) {
        return [controller.findItem(item.itemId)];
    },
    
    getOwnItems: function (userId) {
        var result = [];
        for (var i = 0; i < controller.itemPool.length; i++) {
            if (controller.itemPool[i].userId === userId) result.push(controller.itemPool[i]);
        }
        return result;
    },
    
    getItemList: function () {
        return controller.itemPool;
    },
    
    addItem: function (item) {
        controller.itemPool.push(item);
    },

    joinItem: function (item) {
        var itemId = item.itemId;
        var controllerItem = controller.findItem(itemId);
        if (controllerItem) {
            controllerItem.moneySum += item.amount;
            db.updateItem(controllerItem);
            controller.checkItem(controllerItem);
        }
    },

    addCashUser: function (user) {
        controller.cashUserPool.push(user);
    },
    
    itemStop: function (item, callback) {
        item.status = -1;

        var cashUserId = item.cashUserId;
        var cacheCashUser = controller.findCashUser(cashUserId);
        
        db.updateItem(item, function (err) {
            if (err) {
                err = errorUtil.createError(2, err);
                callback(err);
            }
            else {
                db.queryJoiner(item, function (err, result) {
                    if (err) {
                        err = errorUtil.createError(2, err);
                        callback(err);
                    }
                    else {
                        var joinRecord = result;
                        var failedTimes = 0;
                        externalController.bizUserLogin(cacheCashUser, function (err, result) {
                            joinRecord.forEach(function (record) {
                                if (!err) {
                                    var transferRequest = {
                                        token: result.token,
                                        payword: cacheCashUser.payword,
                                        userId: record.userId,
                                        amount: record.amount
                                    };
                                    externalController.bizUserTransfer(transferRequest, function (err) {
                                        if (err) failedTimes++;
                                    });
                                }
                            });
                        }, function (err) {
                            if (err || failedTimes) {
                                err = errorUtil.createError(13, {failedTimes: failedTimes});
                            }
                            else {
                                cacheCashUser.status = 0;
                                db.updateCashUser(cacheCashUser);
                            }
                            callback(err);
                        });
                    }
                });
            }
        });
    },

    itemSuccess: function (item, callback) {
        item.status = 0;
        
        var amount = item.moneySum;
        var ownerId = item.userId;
        var cashUserId = item.cashUserId;
        var cacheCashUser = controller.findCashUser(cashUserId);
        db.updateItem(item, function (err) {
            if (err) {
                err = errorUtil.createError(2, err);
                callback(err);
            }
            else {
                externalController.bizUserLogin(cacheCashUser, function (err, result) {
                    if (!err) {
                        var transferRequest = {
                            token: result.token,
                            payword: cacheCashUser.payword,
                            userId: ownerId,
                            amount: amount
                        };
                        externalController.bizUserTransfer(transferRequest, function (err) {
                            if (!err) {
                                cacheCashUser.status = 0;
                                db.updateCashUser(cacheCashUser);
                            }
                            callback(err);
                        });
                    }
                    callback(err);
                });
            }
        });
    },
    
    checkAllItems: function () {
        var failedTimes = 0;
        console.info('Start checking..')
        for (var i = 0; i < controller.itemPool.length; i++) {
            var item = controller.itemPool[i];
            controller.checkItem(item);
        }
    },
    
    checkItem: function (item) {
        var currentTime = Date.now();
        if (item.status == 1) {
            if (item.moneySum >= item.moneyGoal) {
                console.info('Item ' + item.itemId + ' success! Updating..');
                controller.itemSuccess(item, function (err) {
                    if (err) {
                        console.warn('Item ' + item.itemId + ' update error! ' + err);
                    }
                });
            }
            else {
                if (item.endTime - currentTime <= 0) {
                    console.info('Item ' + item.itemId + ' stop! Updating..');
                    controller.itemStop(item, function (err) {
                        if (err) {
                            console.warn('Item ' + item.itemId + ' update error! ' + err);
                        }
                    });
                }
            }
        }
    },
};

module.exports = controller;