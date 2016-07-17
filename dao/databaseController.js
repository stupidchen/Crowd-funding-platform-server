/**
 * Created by mike on 7/10/16.
 */
"use strict";

var mysql = require('mysql');
var errorUtil = require('../util/errorUtil');
var configUtil = require('../util/configUtil');

var connection = mysql.createConnection({
    host: configUtil.external.database.host,
    port: configUtil.external.database.port,
    user: configUtil.external.database.user,
    password: configUtil.external.database.password,
    database: configUtil.external.database.scheme,
});

var databaseController = {
    queryItem: function (data, callback) {
        var query = '';
        var fromStartTime = data.fromStartTime;
        var toStartTime = data.toStartTime;
        var fromEndTime = data.fromEndTime;
        var toEndTime = data.toEndTime;
        var first = true;
        if (fromStartTime) {
            if (first) {
                first = false;
            }
            else {
                query += ' AND ';
            }

            query = query + ' startTime >= \"' + fromStartTime + '\"';
        }
        if (toStartTime) {
            if (first) {
                first = false;
            }
            else {
                query += ' AND ';
            }

            query = query + ' startTime <= \"' + toStartTime + '\"';
        }
        if (fromEndTime) {
            if (first) {
                first = false;
            }
            else {
                query += ' AND ';
            }

            query = query + ' startTime >= \"' + fromEndTime + '\"';
        }
        if (toEndTime) {
            if (first) {
                first = false;
            }
            else {
                query += ' AND ';
            }

            query = query + ' startTime <= \"' + toEndTime + '\"';
        }
        if (data.itemId) {
            if (first) {
                first = false;
            }
            else {
                query += ' AND ';
            }

            query = query + ' itemId = \"' + data.itemId + '\"';
        }
        if (data.tag) {
            if (first) {
                first = false;
            }
            else {
                query += ' AND ';
            }

            query = query + ' tag = \"' + data.tag + '\"';
        }
        if (data.userId) {
            if (first) {
                first = false;
            }
            else {
                query += ' AND ';
            }

            query = query + ' userId = \"' + data.userId + '\"';
        }

        if (query.length > 0) {
            connection.query('SELECT * FROM items WHERE ' + query, callback);
        }
        else {
            connection.query('SELECT * FROM items', query, callback);
        }
    },

    queryJoinItems: function (data, callback) {
        var userId = data.userId;

        connection.query('SELECT * FROM items WHERE itemId in (SELECT itemId FROM itemJoiner WHERE userId = ?)', userId, callback);
    },
    
    
    queryLikeItem: function (data, callback) {
        var userId = data.userId;

        connection.query('SELECT * FROM items WHERE itemId in (SELECT itemId FROM itemLike WHERE userId = ?)', userId, callback);
    },
    
    queryCashUser: function (data, callback) {
        if (data.userId) {
            connection.query('SELECT * FROM cashUsers WHERE userId = ?', data.userId, callback);
        }
        else {
            connection.query('SELECT * FROM cashUsers', callback);
        }
    },

    queryJoiner: function (data, callback) {
        connection.query('SELECT * FROM itemJoiner WHERE itemId = ?', data.itemId, callback);
    },

    addItem: function (data, callback) {
        connection.query('INSERT INTO items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [data.itemId, data.userId, data.title, data.cashUserId, data.description, data.startTime,
            data.endTime, data.moneySum, data.moneyGoal, data.status, data.tag],
            callback);
    },
    
    updateCashUser: function (data, callback) {
        connection.query('UPDATE cashUsers u SET u.status = ? WHERE userId = ?', [data.status, data.userId], callback);
    },
    
    updateItem: function (data, callback) {
        var query = '';
        query = ' i.moneySum = ' + data.moneySum;
        connection.query('UPDATE items i SET ' + query + ' WHERE itemId = ?', data.itemId, callback);
        query = ' i.status = ' + data.status;
        connection.query('UPDATE items i SET ' + query + ' WHERE itemId = ?', data.itemId, callback);
    },

    joinItem: function (data, callback) {
        connection.query('INSERT INTO itemJoiner VALUES(?, ?, ?, ?)',
            [data.id, data.itemId, data.userId, data.amount],
            callback);
    },
    
    addCashUsers: function (data, callback) {
        connection.query('INSERT INTO cashUsers VALUES(?, ?, ?, ?)',
            [data.userId, data.password, data.payword, 1],
            callback);
    },
    
    isLikeItem: function (data, callback) {
        connection.query('SELECT * FROM itemLike WHERE itemId = ? AND userId = ?', [data.itemId, data.userId], function (err, result) {
            if (err) {
                callback(err);
                return;
            }
            if (result.length > 0) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        });
    },
    
    changeLikeItem: function (data, callback) {
        this.isLikeItem(data, function (err, result) {
            if (err) {
                callback(err);
                return;
            }
            if (result) {
                connection.query('DELETE FROM itemLike WHERE itemId = ? AND userID = ?', [data.itemId, data.userId]);
                callback(null, [{like: false}]);
            }
            else {
                connection.query('INSERT INTO itemLike VALUES(?, ?)', [data.itemId, data.userId], callback);
                callback(null, [{like: true}]);
            }
        });
    }
};

module.exports = databaseController;
