/**
 * Created by mike on 7/8/16.
 */

var crypto = require('crypto');

var securityUtil = {
    generateToken: function (callback) {
        var token;
        crypto.randomBytes(48, function (err, buffer) {
            token = buffer.toString('Hex');
            callback(token);
        });
    },
    
    generateId: function (callback, len, args) {
        var id;
        crypto.randomBytes(len, function(err, buffer) {
            id = buffer.toString('Hex');
            callback(id);
        });
    }
}

module.exports = securityUtil;
