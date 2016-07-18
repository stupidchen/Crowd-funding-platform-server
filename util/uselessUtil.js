/**
 * Created by mike on 7/18/16.
 */
'use strict';

var uselessUtil = {
    urlPool: ["http://img30.360buyimg.com/cf/jfs/t2794/55/3030040013/107450/5534cc7b/577dea8eN59d5e6f9.jpg","http://img30.360buyimg.com/cf/jfs/t2869/236/3123242555/310567/7fb01ea0/577e3632Na8d26f92.jpg","http://img30.360buyimg.com/cf/jfs/t2641/298/3045693626/112594/30cc6e43/577e167cN7b3def52.gif","http://cs.zhongchoujia.com/UploadFiles/Goods/2016-07/logo/thb20160701180654916416.jpg"],
    
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