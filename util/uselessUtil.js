/**
 * Created by mike on 7/18/16.
 */
'use strict';

var uselessUtil = {
    urlPool: [],
    
    getUrl: function () {
        return this.urlPool;
    },
    
    setUrl: function (id, url) {
        this.urlPool[id] = url;
    },
    
    addUrl: function (url) {
        this.urlPool.push(url);
    }
};

module.exports = uselessUtil;