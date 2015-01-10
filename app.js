var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db_api = require('./routes/dustData');
var routing_for_angluarjs = require('./routes/route_for_angularjs');
//var dustData = require('./routes/dustData');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'bower_components'))); //20141229
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dust', db_api);
app.use('/', routing_for_angluarjs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//-------------------------------------------------------------------------

// 주기적으로 dust data 수집
var puts = require('sys').puts;
var collector = require('./dataCollector');
var collectPeriod = 1000*60*10; //5 min
//var collectPeriod = 1000*20; //

collector.getDustData();

setInterval(function() {
    puts('/////////////////////////////////////////// collect data');
    collector.getDustData();

}, collectPeriod );

//-------------------------------------------------------------------------


module.exports = app;
