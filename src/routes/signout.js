'use strict'
import express from 'express';
import { checkLogin } from '../middlewares/check';

let router = express.Router();

// GET /signout 登出
router.get('/', checkLogin, (req, res, next) => {
  // 清空 session 中用户信息
  req.session.user = null;
  req.flash('success', '登出成功');
  // 登出成功后跳转到主页
  res.redirect('/signin');
});

export default router;
