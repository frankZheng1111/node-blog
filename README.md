# node-blog

一个基于express和mongodb实现的简单的个人博客：实现了博客基本的登入登出，文章和评论的CRUD

主要是个人练习和巩固express的一些常见实现

## 环境依赖

1. node v5.1.1
2. mongodb

## 如何使用

1. 安装依赖：在项目根目录下运行：
  ```
  npm install
  ```
2. 运行：
  ```
  npm start
  ```
3. 访问[localhost:3000](http://localhost:3000)

## 用到的一些库

1. config-lite: 是一个轻量的读取配置文件的模块。
4. [express-session](https://github.com/expressjs/session):  session 中间件
2. [connect-flash](https://github.com/jaredhanson/connect-flash):  中间件，页面显示flash,同过session实现
3. [connect-mongo](https://github.com/jdesboeufs/connect-mongo):  配合express-session, 将session存在mongodb中
5. [ejs](https://github.com/tj/ejs): 模板
6. [express-formidable](https://github.com/noraesae/express-formidable): 接收表单及文件的上传中间件
7. marked: 解析markdown
8. [mongolass](https://github.com/mongolass/mongolass): mongodb 驱动
7. objectid-to-timestamp: 根据 ObjectId 生成时间戳
8. [winston](https://github.com/winstonjs/winston): 日志
9. [express-winston](https://github.com/bithavoc/express-winston): 基于 winston 的用于 express 的日志中间件
10. [supertest](https://github.com/visionmedia/supertest): 测试API
