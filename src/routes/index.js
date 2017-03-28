import signup from './signup';
import signin from './signin';
import signout from './signout';
import posts from './posts';
module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts');
  });
  app.use('/signup', signup);
  app.use('/signin', signin);
  app.use('/signout', signout);
  app.use('/posts', posts);
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404');
    }
  });
};
