'use strict'
import fs from 'fs';
import path from 'path';
import sha1 from 'sha1';
import express from 'express';
import User from '../models/users';
import { checkNotLogin } from '../middlewares/check';

let router = express.Router();

// GET /signup 注册页
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, (req, res, next) => {
  let name = req.fields.name;
  let gender = req.fields.gender;
  let bio = req.fields.bio;
  let avatar = req.files.avatar.path.split(path.sep).pop();
  let password = req.fields.password;
  let repassword = req.fields.repassword;

  // 校验参数
  try {
    if (!req.files.avatar.name) {
      throw new Error('缺少头像');
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符');
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path);
    req.flash('error', e.message);
    return res.redirect('/signup');
  }

  // 明文密码加密
  password = sha1(password);

  // 待写入数据库的用户信息
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  };
  // 用户信息写入数据库
  User.createNewUser(user)
    .then((user) => {
      // 将用户信息存入 session
      delete user.password;
      req.session.user = user;
      // 写入 flash
      req.flash('success', '注册成功');
      // 跳转到首页
      res.redirect('/posts');
    })
  .catch((e) => {
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path);
    // 用户名被占用则跳回注册页，而不是错误页
    if (e.message.match('E11000 duplicate key')) {
      req.flash('error', '用户名已被占用');
      return res.redirect('/signup');
    }
    // 参数不能通过校验
    if (e.name === 'ValidationError') {
      req.flash('error', e.toString().replace('ValidationError:', ''));
      return res.redirect('/signup');
    }
    next(e);
  });
});

export default router;
