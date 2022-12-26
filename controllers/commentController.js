const Comment = require('../models/comments');
const Post = require('../models/posts');

exports.addComment = (req, res, next) => {
    let newComment = new Comment({
        user: req.user,
        post: req.params.id,
        text: req.body.comment,
        likes: 0,
    });

    newComment.save((err, result) => {
        if (err) {return next(err);}
        Post.findByIdAndUpdate(req.params.id, {$push: {comments: result}}).exec((err, result) => {
            if (err) {return next(err);}
            res.redirect('/');
        });
    });
};