const Comment = require('../models/comments');
const Reply = require('../models/replies');
const Post = require('../models/posts');
const User = require('../models/users');

exports.addComment = (req, res, next) => {
    const newComment = new Comment({
        user: req.user,
        post: req.params.id,
        text: req.body.comment,
        likes: 0,
    });

    newComment.save((err, result) => {
        if (err) {return next(err);}
        Post.findByIdAndUpdate(req.params.id, {$push: {comments: result}}).exec((err, r) => {
            if (err) {return next(err);}
            console.log(result.text);
            res.json(result);
        });
    });
};

exports.addReply = (req, res, next) => {
    const newReply = new Reply({
        user: req.user,
        replyingTo: req.body.replyingTo,
        text: req.body.text,
        likes: 0,
    });

    newReply.save((err, result) => {
        if (err) {return next(err);}
        Comment.findByIdAndUpdate(req.params.id, {$push: {replies: result}}).exec((err, r) => {
            if (err) {return next(err);}
            console.log(result.text);
            res.json(result);
        });
    });
}


exports.addLikeReply = (req, res, next) => {
    Reply.findById(req.params.id).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$push: {likedReplies: result}}).exec((err, eh) => {
            if (err) {return next(err);}

            Reply.findByIdAndUpdate(result._id, {likes: result.likes + 1}).exec((err, result) => {
                if (err) {return next(err);}

                res.send("succes");
            });
        });
    });
};

exports.removeLikeReply = (req, res, next) => {
    Reply.findById(req.params.id).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$pull: {likedReplies: result}}).exec((err, eh) => {
            if (err) {return next(err);}

            Reply.findByIdAndUpdate(result._id, {likes: result.likes - 1}).exec((err, result) => {
                if (err) {return next(err);}

                res.send("succes");
            });
        });
    });
};


exports.removeLike = (req, res, next) => {
    Comment.findById(req.params.id).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$pull: {likedComments: result}}).exec((err, eh) => {
            if (err) {return next(err);}

            Comment.findByIdAndUpdate(result._id, {likes: result.likes - 1}).exec((err, result) => {
                if (err) {return next(err);}

                res.send("succes");
            });
        });
    });
};


exports.addLike = (req, res, next) => {
    Comment.findById(req.params.id).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$push: {likedComments: result}}).exec((err, eh) => {
            if (err) {return next(err);}

            Comment.findByIdAndUpdate(result._id, {likes: result.likes + 1}).exec((err, result) => {
                if (err) {return next(err);}

                res.send("succes");
            });
        });
    });
};