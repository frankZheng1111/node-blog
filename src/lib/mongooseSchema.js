'use strict'
import config from 'config-lite'
import mongoose from 'mongoose'

mongoose.connect(config.mongodb);

export let userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [1, '名字请限制在 1-10 个字符'],
    maxlength: [10, '名字请限制在 1-10 个字符'],
    unique : [true, '用户名已存在']
  },
  password: {
    type: String
    // 加密后长度肯定满足的==
    // minlength: [6, '密码至少 6 个字符']
  },
  avatar: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['m', 'f', 'x']
  },
  bio: {
    type: String,
    minlength: [1, '个人简介请限制在 1-30 个字符'],
    maxlength: [30, '个人简介请限制在 1-30 个字符']
  },
  createdAt: { type : Date, default : Date.now }
});
