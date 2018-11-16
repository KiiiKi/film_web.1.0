var createError = require('http-errors');// HTTP Error是一种响应错误。根据不同的错误,会提示相应的错误代码
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');//cookie-parser 的作用就是设置，获取和删除 cookie。
var logger = require('morgan');//记录日志
var bodyParser = require('body-parser');//对post请求的请求体进行解析，可获得一个JSON化的req.body

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));//设置模版在views文件夹下。之后在路由中调用视图模版时，可以省略写views/路径
app.set('view engine', 'jade');//设置视图模版引擎为jade

app.use(logger('dev'));//将请求信息打印在控制台，便于开发调试
//生产环境中，需要将日志记录在log文件里：app.use(logger('combined', {stream : accessLog}));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));  
//app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));//静态文件位置

app.locals.moment = require('moment')//获取各种时间格式

app.use('/', indexRouter);//设置主路由路径
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error')
});

module.exports = app;
