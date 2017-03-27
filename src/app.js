import path from 'path';
import express from 'express';
import session from 'express-session';
import _connectMongo from 'connect-mongo';
import flash from 'connect-flash';
import config from 'config-lite';
import routes from './routes';
import pkg from '../package';
import winston from 'winston'
import expressWinston from 'express-winston'

let MongoStore = _connectMongo(session)
let app = express();

// 设置模板目录
app.set('views', path.join(__dirname, '../views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '../public')));
// session 中间件
app.use(session({
  name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true,// 强制更新 session
  saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}));
// flash 中间件，用来显示通知
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, '../public/img'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

// 添加模板必需的三个变量
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/node_blog.log'
    })
  ]
}));

// 路由
routes(app);

// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/node_blog_${dateStr}_error.log'
    })
  ]
}));

// error page
app.use((err, req, res, next) => {
  res.render('error', {
    error: err
  });
});

// 直接启动 app.js 则会监听端口启动程序，如果 app.js 被 require 了，则导出 app
//
if (!module.parent) {
  app.listen(config.port, () => {
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}
module.exports=app;
