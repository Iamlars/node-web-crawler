var express = require('express');
var Promise = require('promise');

var model = require('./models');
var cheerio = require('./cheerio');
var link = model.Links;

var app = express();

var save = function(data){
    return new Promise(function(resolve,reject){

        new link({content: JSON.stringify(data)}).save(function (err) {
            if (err) reject(err);
            resolve(data);
        });
    })
};

var find = function(){
    return new Promise(function(resolve,reject){

        link.find(function (err,docs) {
            if (err) reject(err);
            resolve(docs);

        });
    })
};


app.get('/', function (req, res, next) {

    var urls = [];
    var urlLen = 21;
    for(var page = 1; page < urlLen; page++) {
        urls.push('http://mxd.sdo.com/web5/news/newsList.asp?page='+page+'&CategoryID=a');
    }

    // 获取全部21个分页列表内容,最大并发数5
    //cheerio.limit(urls,5).then(function(data){
    //    save(data);
    //}).then(function(){
    //    find();
    //}).then(function(docs){
    //    res.send(docs);
    //});


    find().then(function(docs){
        res.send(docs);
    });

});




app.listen(3000, function () {
    console.log('app is listening at port 3000');
});