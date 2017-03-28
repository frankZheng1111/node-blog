import sha1 from 'sha1';
import express from 'express';
import User from '../models/users';
import { checkNotLogin } from '../middlewares/check';

let router = express.Router();

// GET /signin 登录页
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signin');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, (req, res, next) => {
  let name = req.fields.name;
  let password = req.fields.password;

  User.findByName(name)
    .then((user) => {
      console.log(user)
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('back');
      }
      // 检查密码是否匹配
      if (sha1(password) !== user.password) {
        req.flash('error', '用户名或密码错误');
        return res.redirect('back');
      }
      req.flash('success', '登录成功');
      // 用户信息写入 session
      delete user.password;
      req.session.user = user;
      // 跳转到主页
      res.redirect('/posts');
    })
  .catch(next);
});

export default router;

