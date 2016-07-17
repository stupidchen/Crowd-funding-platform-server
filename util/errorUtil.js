/**
 * Created by mike on 7/8/16.
 */
"use strict";

var errorUtil = {
    getErrorCode: function (error) {
        if (error && error.statusCode) {
            return error.statusCode;
        }
        else {
            return 0;
        }
    },
    
    createError: function (errorCode, detail) {
        var err = {
            statusCode: errorCode,
            detail: detail,
            host: 'unknown',
            message: 'Unknown error'
        };
        switch (errorCode) {
            case 15:
                err.host = 'client';
                err.message = 'This item has been stop!'
                break;
            
            case 14:
                err.host = 'client';
                err.message = 'This item is not exist!';
                break;
            
            case 13:
                err.host = 'interaction';
                err.message = 'Disconnect from payment-platform.';
                break;
            
            case 12:
                err.host = 'client';
                err.message = 'The item is not exist!';
                break;
            
            case 11:
                err.host = 'interaction';
                err.message = 'Add business user failed';
                break;
            
            case 10:
                err.host = 'system';
                err.message = 'Serious error. Please contact to the system admin';
                break;
            
            case 9:
                err.host = 'system';
                err.message = 'Serious error. The operation has been cancelled.';
                break;
            
            case 1:
                err.host = 'system';
                err.message = 'ID or password is incorrect!';
                break;
            
            case 2:
                err.host = 'database';
                err.message = 'database error';
                break;
            
            case 3:
                err.host = 'system';
                err.message = 'system error';
                break;
            
            case 4:
                err.host = 'client';
                err.message = 'This user has been login!';
                break;
            
            case 5:
                err.host = 'client';
                err.message = 'Token is invalid!';
                break;
                
            case 6:
                err.host = 'client';
                err.message = 'This ID has been registered!';
                break;
                
            case 7:
                err.host = 'client';
                err.message = 'The payword is incorrect!';
                break;
                
            case 8: 
                err.host = 'client';
                err.message = 'Insufficient balance!';
                break;
        }
        return err; 
    }
};

module.exports = errorUtil;
