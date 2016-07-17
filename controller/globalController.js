/**
 * Created by mike on 7/10/16.
 */
"use strict";

var db = require('../dao/databaseController');
var externalController = require('./externalController');
var dataPoolController = require('./dataPoolController');
var securityUtil = require('../util/securityUtil');
var errorUtil = require('../util/errorUtil');

var controller = {
    init: function (data, callback) {
        var err = null;
        if (data.token && data.userId) {
            securityUtil.addTokenByUserId(data.userId, data.token);
        }
        else {
            err = errorUtil.createError(13);
        }
        callback(err);
    },

    logout: function (data, callback) {
        securityUtil.removeToken(data.token);
        callback();
    },

    getItemList: function (data, callback) {
        securityUtil.verifyToken(data.token, function(err, userId) {
            if (err) {
                callback(err);
                return;
            }
            callback(err, dataPoolController.getItemList());
        });
    },

    getOwnItems: function (data, callback) {
        securityUtil.verifyToken(data.token, function(err, userId) {
            if (err) {
                callback(err);
                return;
            }
            callback(err, dataPoolController.getOwnItems(userId));
        });
    },

    getJoinItems: function (data, callback) {
        securityUtil.verifyToken(data.token, function(err, userId) {
            if (err) {
                callback(err);
                return;
            }
            data.userId = userId;
            db.queryJoinItems(data, callback);
        });
    },

    getItemInfo: function (data, callback) {
        securityUtil.verifyToken(data.token, function(err, userId) {
            var result;
            if (!err) result = dataPoolController.getItemInfo(data);

            callback(err, result);
        });
    },

    //Like item
    getLikeItemList: function (data, callback) {
        securityUtil.verifyToken(data.token, function (err, userId) {
            data.userId = userId;
            if (!err) {
                db.queryLikeItem(data, function (err, result) {
                    if (err) {
                        err = errorUtil.createError(2, err);
                    }
                    callback(err, result);
                });
            }
            else {
                callback(err);
            }
        });
    },

    isLikeItem: function (data, callback) {
        securityUtil.verifyToken(data.token, function (err, userId) {
            data.userId = userId;
            if (!err) {
                db.isLikeItem(data, function (err, result) {
                    if (err) {
                        err = errorUtil.createError(2, err);
                    }
                    callback(err, [{like: result}])
                });
            }
            else {
                callback(err);
            }
        });
    },

    changeLikeItem: function (data, callback) {
        securityUtil.verifyToken(data.token, function (err, userId) {
            data.userId = userId;
            if (!err) {
                db.changeLikeItem(data, function (err, result) {
                    if (err) {
                        err = errorUtil.createError(2, err);
                    }
                    callback(err, result);
                });
            }
            else {
                callback(err);
            }
        });
    },

    //Normal item
    addItem: function (data, callback) {
        securityUtil.verifyToken(data.token, function (err, userId) {
            if (!err) {
                data.userId = userId;
                securityUtil.generateRandomBytes(7, null, function (itemId) {
                    data.itemId = itemId;
                    securityUtil.generateCashUser(null, function (cashUserData) {
                        externalController.addBizUser(cashUserData, function (err) {
                            if (err) {
                                callback(err);
                            }
                            else {
                                data.cashUserId = cashUserData.userId;
                                data.status = 1;
                                data.moneySum = 0;
                                data.startTime = new Date().toMysqlFormat();
                                db.addItem(data, function (err) {
                                    if (err) {
                                        callback(errorUtil.createError(2), err);
                                    }
                                    else {
                                        db.queryItem({itemId: itemId}, function (err, result) {
                                            if (err) {
                                                callback(errorUtil.createError(2), err);
                                            }
                                            else {
                                                dataPoolController.addItem(result[0]);
                                                db.addCashUsers(cashUserData, function (err) {
                                                    if (err) {
                                                        err = errorUtil.createError(2, err);
                                                    }
                                                    else {
                                                        dataPoolController.addCashUser(cashUserData);
                                                    }
                                                    callback(err);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            }
            else {
                callback(err);
            }
        });
    },

    joinItem: function (data, callback) {
        securityUtil.verifyToken(data.token, function (err, userId) {
            if (!err) {
                data.userId = userId;
                var item = dataPoolController.findItem(data.itemId);
                if (item && item.status == 1) {
                    securityUtil.generateRandomBytes(7, null, function (recordId) {
                        data.id = recordId;
                        db.joinItem(data, function (err) {
                            if (err) {
                                err = errorUtil.createError(2, err);
                            }
                            else {
                                dataPoolController.joinItem(data);
                            }
                            callback(err);
                        });
                    });
                }
                else {
                    if (!item) {
                        callback(errorUtil.createError(14));
                    }
                    else {
                        callback(errorUtil.createError(15));
                    }
                }
            }
            else {
                callback(err);
            }
        });
    },
};

module.exports = controller;
