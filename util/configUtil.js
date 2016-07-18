/**
 * Created by mike on 7/17/16.
 */
"use strict";

var config = {
    external: {
        pay: {
            host: process.env.PAY_HOST || 'localhost',
            port: process.env.PAY_PORT || '3000',
            method: process.env.PAY_METHOD || 'POST'
        },

        database: {
            host: process.env.MYSQL_HOST || 'localhost',
            port: process.env.MYSQL_PORT || '3306',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '12345687',
            scheme: process.env.MYSQL_SCHEME || 'xcccf_cf',
        }
    },

    system: {
        checkerInterval: process.env.CHECKER_INTERVAL || 60000,
        interface: {
            init: '/init',
            logout: '/logout',
            getItemInfo: '/getItemInfo',
            getItems: '/getItemList',
            getLikeItems: '/getLikeItemList',
            isLikeItem: '/isLikeItem',
            changeLikeItem: '/changeLikeItem',
            addItem: '/addItem',
            joinItem: '/joinItem',
            getOwnItems: '/getOwnItems',
            getJoinItems: '/getJoinItems',
            getUrl: '/getUrl',
            setUrl: '/setUrl',
            addUrl: '/addUrl'
        }
    },
}

module.exports = config;

