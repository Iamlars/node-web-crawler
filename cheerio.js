var cheerio = require('cheerio');
var readability = require('node-readability-cheerio');
var async = require('async');

var concurrencyCount = 0;

var getLink = function(url){
    return new Promise(function (resolve, reject){

        var delay = parseInt((Math.random() * 10000000) % 2000, 10);
        concurrencyCount++;
        setTimeout(function () {
            concurrencyCount--;
            readability.read(url, function(err, $) {
                if (err) {
                    reject(err);
                }
                var items = [];
                $('.newsLists a').each(function (idx, element) {
                    var $element = $(element);
                    items.push({
                        title: $element.attr('title'),
                        href: $element.attr('href')
                    });
                });
                resolve(items);
            });
        }, delay);
    });
};


// 控制并发
var limit = function(urls,max){
    return new Promise(function(resolve,reject){
        var allLinks = {};
        var visited = 0;
        async.mapLimit(urls, max, function (url) {
            getLink(url).then(function(items){
                allLinks['page'+visited++] = items;
                if(visited >= 5){
                    resolve(allLinks);
                    return;
                }
            });
        }, function (err, result) {
            console.log('final:');
            console.log(result);
            reject(err)
        });
    })
};



// 获取详情
var getHTML =  function(url){
    return new Promise(function (resolve, reject){
        readability.read(url, function(err, $) {
            if (err) {
                reject(err);
            }

            resolve($('.innerContent').html());
        });
    });
};


exports.limit = limit;