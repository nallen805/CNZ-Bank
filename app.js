var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
var helmet = require('helmet');
var favicon = require('serve-favicon');
var app = express();

var bodyparser=require('body-parser');

//Create router
var router = require('./routes/route')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use('/', router);

//Favicon
app.use(favicon(path.join(__dirname, 'public', 'growth.png')));

// catch 404 and forward to error handler
app.all('*', function(req, res, next)
{
  var err = new Error();
  err.status=404;
  next(err);
});

//User-friendly error handler
// app.use(function(err, req, res, next)
// { res.render('error', {message: 'Sorry, the page you requested does not exist', linked:'http://localhost:4116'})  });

//Error-handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen('4116');
console.log('Server started on port 4116');
module.exports = app;
