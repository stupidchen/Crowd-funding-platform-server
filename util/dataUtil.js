/**
 * Created by mike on 7/16/16.
 */
/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/

var util = {
    twoDigits: function (d) {
        if (0 <= d && d < 10) return "0" + d.toString();
        if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
        return d.toString();
    },

    /**
     * …and then create the method to output the date string as desired.
     * Some people hate using prototypes this way, but if you are going
     * to apply this to more than one Date object, having it as a prototype
     * makes sense.
     **/
    addMySqlFormat: function () {
        Date.prototype.toMysqlFormat = function () {
            return this.getFullYear() + "-" + util.twoDigits(1 + this.getMonth()) + "-" + util.twoDigits(this.getDate()) + " " + util.twoDigits(this.getHours()) + ":" + util.twoDigits(this.getMinutes()) + ":" + util.twoDigits(this.getSeconds());
        };
    }
};

module.exports = util;