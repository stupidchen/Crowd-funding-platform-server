/**
 * Created by mike on 7/8/16.
 */
"use strict";

var crypto = require('crypto');
var errorUtil = require('./errorUtil');

var securityUtil = {
    tokenPool: [],
    
    addTokenByUserId: function (userId, token) {
        this.tokenPool[token] = userId;
    },
    
    removeToken: function (token) {
        this.tokenPool[token] = undefined;
    },
    
    verifyToken: function (token, callback) {
        if (token && this.tokenPool[token]) {
            callback(null, this.tokenPool[token]);
        }
        else {
            callback(errorUtil.createError(5));
        }
    },
    
    generateRandomBytes: function (len, args, callback) {
        crypto.randomBytes(len, function(err, buffer) {
            var result = buffer.toString('Hex');
            callback(result);
        });
    },

    generateCashUser: function (args, callback) {
        securityUtil.generateRandomBytes(7, args, function (cashUserId) {
            securityUtil.generateRandomBytes(16, args, function (password) {
                securityUtil.generateRandomBytes(16, args, function(payword) {
                    callback({
                        userId: cashUserId,
                        password: password,
                        payword: payword
                    });
                });
            });
        });
    }
}

module.exports = securityUtil;
