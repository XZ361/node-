var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs=require('ejs');
var bodyParser=require('body-parser');
//可以使用中间件注入插件，诸如路由

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());//对发送的post请求 做一些json转换
app.use(express.static(path.join(__dirname, 'public')));

//在任何路由使用之前，先执行该拦截方法,及全局拦截
app.use((req,res,next)=>{
  //先判断用户是否已经登录，首先获取cookie，从客户端获取保存的cookie
  //若cookie存在，则证明用户已经登陆了
  //直接next
  if(req.cookies.userId){
    next();
  }else{
    //如果是登陆，登出接口的调用或则对商品信息接口的调用，则可以进行下一步
    //path指的是当前接口的地址，/goods/list代表当前的路由,通过req.path来去匹配当前你路径，代表搜索到了
    if(req.originalUrl=='/users/login'||req.originalUrl=='/users/logout'||req.path=="/goods/list"){
      next();
    }else{
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      })
    }
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

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
  res.render('error');
});

module.exports = app;
