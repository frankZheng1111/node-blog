import path from 'path';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/lib/mongo'

var testName1 = 'testName1';
var testName2 = 'testName2';

describe('signup', () => {
  describe('POST /signup', () => {
    var agent = request.agent(app);//persist cookie when redirect
    beforeEach((done) => {
      // 创建一个用户
      User.create({
        name: testName1,
        password: '123456',
        avatar: '',
        gender: 'x',
        bio: ''
      })
      .exec()
        .then(() => {
          done();
        })
      .catch(done);
    });

    afterEach((done) => {
      // 删除测试用户
      User.remove({ name: { $in: [testName1, testName2] } })
        .exec()
        .then(() => {
          done();
        })
      .catch(done);
    });

    // 名户名错误的情况
    it('wrong name', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'testAvatar.jpg'))
        .field({ name: '' })
        .redirects()
        .end((err, res) => {
          if (err) return done(err);
          assert(res.text.match(/名字请限制在 1-10 个字符/));
          done();
        });
    });

    // 性别错误的情况
    it('wrong gender', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'testAvatar.jpg'))
        .field({ name: testName2, gender: 'a' })
        .redirects()
        .end((err, res) => {
          if (err) return done(err);
          assert(res.text.match(/性别只能是 m、f 或 x/));
          done();
        });
    });
    // 其余的参数测试自行补充
    // 用户名被占用的情况
    it('duplicate name', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'testAvatar.jpg'))
        .field({ name: testName1, gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
        .redirects()
        .end((err, res) => {
          if (err) return done(err);
          assert(res.text.match(/用户名已被占用/));
          done();
        });
    });

    // 注册成功的情况
    it('success', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'testAvatar.jpg'))
        .field({ name: testName2, gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
        .redirects()
        .end((err, res) => {
          if (err) return done(err);
          assert(res.text.match(/注册成功/));
          done();
        });
    });
  });
});
