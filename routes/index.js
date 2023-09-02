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
router.post('/:id/reply', Comment.addReply);

router.post('/log-out', (req, res, next) => {
  req.logOut((err) => {
    if (err) {return next(err);}

    res.redirect('/');
  });
});


router.post('/:id/add-like', Post.addLike);
router.post('/:id/remove-like', Post.removeLike);

router.post('/:id/add-like-comment', Comment.addLike);
router.post('/:id/remove-like-comment', Comment.removeLike);

router.post('/:id/add-like-reply', Comment.addLikeReply);
router.post('/:id/remove-like-reply', Comment.removeLikeReply);

module.exports = router;
