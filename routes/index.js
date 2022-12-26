var express = require('express');
var router = express.Router();
const Post = require('../controllers/postController');
const Comment = require('../controllers/commentController');

/* GET home page. */
router.post('/exp', (req, res, next) => {
  console.log(req.body);
});


router.get('/', Post.timeline);

router.get('/log-in', (req, res, next) => {
  res.render("log-in", {title: "Log-in", message: req.session.message});
});

router.get('/sign-up', (req, res, next) => {
  res.render("sign-up", {title: "Sign-up", message: ""});
});

router.post('/post', Post.addPost);
router.post('/:id/comment', Comment.addComment);

router.post('/log-out', (req, res, next) => {
  req.logOut((err) => {
    if (err) {return next(err);}

    res.redirect('/');
  });
});


router.post('/:id/add-like', Post.addLike);
router.post('/:id/remove-like', Post.removeLike);

module.exports = router;
