/**
 * Created by mike on 7/10/16.
 */
"use strict";

var mysql = require('mysql');
var errorUtil = require('../util/errorUtil');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '12345687',
    database: 'xcccf_cf',
});

function getSQLDateTime(normalDate) {
    var date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
}

var databaseController = {
    queryItem: function (data, callback) {
        var query = '';
        var fromStartTime = getSQLDateTime(data.fromStartTime);
        var toStartTime = getSQLDateTime(data.toStartTime);
        var fromEndTime = getSQLDateTime(data.fromEndTime);
        var toEndTime = getSQLDateTime(data.toEndTime);
        if (data.fromStartTime) {
            query = query + ' startTime >= ' + fromStartTime + ' AND';
        }
        if (data.toStartTime) {
            query = query + ' startTime <= ' + toStartTime + ' AND';
        }
        if (data.fromEndTime) {
            query = query + ' startTime >= ' + fromEndTime + ' AND';
        }
        if (data.toEndTime) {
            query = query + ' startTime <= ' + toEndTime + ' AND';
        }
        if (data.itemId) {
            query = query + ' itemId = ' + data.itemId + ' AND';
        }
        if (data.tag) {
            query = query + ' tag = ' + data.tag + ' AND';
        }
        connection.query('SELECT * FROM users WHERE ?', query, callback);
    },
    
    queryLikeItem: function (data, callback) {
        var userId = data.userId;

        connection.query('SELECT * FROM (itemLike join items) WHERE userId = ?', userId, callback);
    },
    
    queryCashUser: function (data, callback) {
        if (data.userID) {
            connection.query('SELECT * FROM users WHERE userId = ?', data.userId, callback);
        }
        else {
            connection.query('SELECT * FROM users', callback);
        }
    },

    queryJoiner: function (data, callback) {
        connection.query('SELECT * FROM itemJoiner WHERE itemId = ?', data.itemId, callback);
    },

    addItem: function (data, callback) {
        var startTime = getSQLDateTime(data.startTime);
        var endTime = getSQLDateTime(data.endTime);
        connection.query('INSERT INTO items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [data.itemId, data.userId, data.cashUserId, data.title, data.description, startTime,
            endTime, 0, data.moneyGoal, data.status, data.tag],
            callback);
    },

    joinItem: function (data, callback) {
        connection.query('INSERT INTO itemJoiner VALUES(?, ?, ?, ?)',
            [data.id, data.itemId, data.userId, data.money],
            callback);
    },
    
    addCashUsers: function (data, callback) {
        connection.query('INSERT INTO cashUsers VALUES(?, ?, ?, ?)',
            [data.userId, data.password, data.payword, 1],
            callback);
    },

    addLikeItem: function (data, callback) {
        connection.query('INSERT INTO itemLike VALUES(?, ?)', [data.itemId, data.userId], function (err) {
            var msg = {
                err: err
            };
            callback(err);
        });
    },

    removeLikeItem: function (data, callback) {
        connection.query('DELECT FROM itemLike WHERE itemId = ? AND userID = ?', [data.itemId, data.userId], function (err) {
            var msg = {
                err: err
            };
            callback(err);
        });
    },
};

module.exports = databaseController;
