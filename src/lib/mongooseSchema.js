'use strict'
import config from 'config-lite'
import mongoose from 'mongoose'

mongoose.connect(config.mongodb);

export let userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [1, '名字请限制在 1-10 个字符'],
    maxlength: [10, '名字请限制在 1-10 个字符']
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

userSchema.index({ name: 1 }, { unique: true });

export let postSchema = mongoose.Schema({
  author: {
    type: Objectid,
    required: true
  },
  title: {
    type: String,
    required: [true, '请填写标题']
  },
  content: {
    type: String,
    required: [true, '请填写内容']
  },
  pv: {
    type: Number
  } // 被浏览次数
});
postSchema.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表

export let commentSchema = mongoose.Schema({
  author: {
    type: Objectid
  },
  content: {
    type: String
  },
  postId: {
    type: Objectid
  }
});
commentSchema.index({ postId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
commentSchema.index({ author: 1, _id: 1 }).exec();// 通过用户 id 和留言 id 删除一个留言

