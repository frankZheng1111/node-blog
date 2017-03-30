'use strict'
import { postSchema as Post } from '../lib/mongooseSchema';
import mongoose from 'mongoose';
import marked from 'marked';
import Comment from './comments'

function addCommentsCount (schema) {
  schema.add({ commentsCount: Number })

  schema.post('find', (posts, done) => {
    if (!posts.length) { done(); return posts; }
    return posts.map((post) => {
      return Promise.all(posts.map((post) => {
        return Comment.countByPostId(post._id).then((commentsCount) => {
          post.commentsCount = commentsCount;
          done();
          return post;
        });
      }));
    });
  });

  schema.post('findOne', (post, done) => {
    if (post) {
      return Comment.countByPostId(post._id).then((commentsCount) => {
        post.commentsCount = commentsCount;
        done();
        return post;
      });
    }
    done();
    return post;
  });
}

function contentsToHtml (schema) {
  schema.post('find', (posts) => {
    return posts.map((post) => {
      post.content = marked(post.content);
      return post;
    });
  });
}

Post.plugin(contentsToHtml);
Post.plugin(addCommentsCount);

Post.methods = {
  contentToHtml() {
    this.content = marked(this.content);
    return this;
  }
};

Post.statics = {
  // 创建一篇文章
  createNewPost(post) {
    return this.create(post);
  },

  // 通过文章 id 获取一篇文章
  findById(postId) {
    return this
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .exec();
  },

  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  findAllByAuthor(author) {
    var query = {};
    if (author) {
      query.author = author;
    }
    return this
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .exec();
  },

  // 通过文章 id 给 pv 加 1
  incPv(postId) {
    return this
      .update({ _id: postId }, { $inc: { pv: 1 } })
      .exec();
  },

  // 通过文章 id 获取一篇原生文章（编辑文章）
  findRawPostById(postId) {
    return this
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .exec();
  },

  // 通过用户 id 和文章 id 更新一篇文章
  updateById(postId, author, data) {
    return this.update({ author: author, _id: postId }, { $set: data }).exec();
  },

  // 通过用户 id 和文章 id 删除一篇文章
  delById(postId, author) {
    return this.remove({ author: author, _id: postId })
      .exec()
      .then((res) => {
        // 文章删除后，再删除该文章下的所有留言
        if (res.result.ok && res.result.n > 0) {
          return Comment.delByPostId(postId);
        }
      });
  }
};

export default mongoose.model('Post', Post);
