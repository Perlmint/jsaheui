var Crawler = require("crawler");
var jsonfile = require('jsonfile');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');

dict = {}

var krs = new Crawler({
    maxConnections : 10,
    userAgent: "curl/7.43.0",
    callback: function(error, result, $) {
        if (result.request.response.statusCode != 200) {
            console.log("Error!");
            return;
        }
        // javascript:setCharInfo('1','㐐','U+3410','乙','5','6','놀');
        $('a[onmouseover^="javascript:setCharInfo"]').each(function(i, e) {
            func_body = e.attribs.onmouseover;
            func_body = '[' + func_body.substr(func_body.indexOf('setCharInfo') + 12);
            args = eval(func_body.substr(0, func_body.indexOf(');')) + ']');
            ch = parseInt(args[2].substr(2), 16);
            pro = args[args.length - 1].replace(',', '').trim();
            if (pro.length != 0) {
                dict[ch] = pro;
            }
        });
    },
    onDrain: function() {
        fs.writeFile('han_to_kr.js', 'chinese_to_kr = ')
        jsonfile.writeFile('han_to_kr.js', dict, {"flag": 'a'}, function (err) {
            console.error(err);
        });
    }
});

base_url = 'http://www.koreanhistory.or.kr/newchar/grid_list.jsp?code_type=%d&codebase=%s'
_.map([[1, 52, 159], [2, 512, 678]], function(e) {
    for (var i = e[1]; i <= e[2]; i++) {
        url = util.format(base_url, e[0], i.toString(16).toUpperCase());
        krs.queue(url);
    }
});
