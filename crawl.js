var Crawler = require("crawler");
var url = require('url');
var jsonfile = require('jsonfile')

dict = {}

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        v = $('#firstHeading').text().split(':')[1];
        $('.mw-category-group h3').each(function(i, e) {
            text = $(e).text();
            if (dict.hasOwnProperty(v)) {
                dict[text] = dict[text] + v;
            } else {
                dict[text] = v;
            }
        });
    },
    onDrain: function() {
        jsonfile.writeFile('han_to_kr.js', dict, function (err) {
            console.error(err)
        })
    }
});

var krs = new Crawler({
    maxConnections : 10,
    callback: function(error, result, $) {
        $('a.CategoryTreeLabel').each(function(i, e) {
            kr_url = e.attribs.href;
            c.queue('https://ko.wiktionary.org' + kr_url);
            console.log(kr_url);
        })
    },
});

krs.queue('https://ko.wiktionary.org/w/index.php?title=%EB%B6%84%EB%A5%98:%ED%95%9C%EC%9E%90_%EC%9D%8C&subcatuntil=%EC%83%81#mw-subcategories');
krs.queue('https://ko.wiktionary.org/w/index.php?title=%EB%B6%84%EB%A5%98:%ED%95%9C%EC%9E%90_%EC%9D%8C&subcatfrom=%EC%83%81#mw-subcategories');
krs.queue('https://ko.wiktionary.org/w/index.php?title=%EB%B6%84%EB%A5%98:%ED%95%9C%EC%9E%90_%EC%9D%8C&subcatfrom=%ED%8F%84#mw-subcategories');
