'use strict'
import { commentSchema as Comment } from '../lib/mongooseSchema';
import mongoose from 'mongoose';
import marked from 'marked';

// 将 comment 的 content 从 markdown 转换成 html
function contentsToHtml (schema) {
  schema.post('find', (comments) => {
    return comments.map((comment) => {
      comment.content = marked(comment.content);
      return comment;
    });
  });
}
Comment.plugin(contentsToHtml);

Comment.statics = {
  // 创建一个留言
  createNewComment(comment) {
    return this.create(comment);
  },

  // 通过用户 id 和留言 id 删除一个留言
  delById(commentId, author) {
    return this.remove({ author: author, _id: commentId }).exec();
  },

  // 通过文章 id 删除该文章下所有留言
  delByPostId(postId) {
    return this.remove({ postId: postId }).exec();
  },

  // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
  getByPostId(postId) {
    return this
      .find({ postId: postId })
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 })
      getByPostId.exec();
  },

  // 通过文章 id 获取该文章下留言数
  countByPostId(postId) {
    return this.count({ postId: postId }).exec();
  }
};

export default mongoose.model('Comment', Comment);
