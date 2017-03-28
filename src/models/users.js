'use strict'
import { userSchema as User } from '../lib/mongooseSchema'
import mongoose from 'mongoose'

User.statics = {
  // 注册一个用户
  //
  createNewUser(user) {
    return this.create(user);
  },

  // 通过用户名获取用户信息
  //
  findByName(name) {
    return this
      .findOne({ name: name })
      .exec();
  }
}
User.index({ name: 1 });

export default mongoose.model('User', User);

