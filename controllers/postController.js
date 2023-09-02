var Post = require('../models/posts');
var User = require('../models/users');
var Comment = require('../models/comments');
var Reply = require('../models/replies');
var async = require('async');


exports.removeLike = (req, res, next) => {
    Post.findById(req.params.id).exec((err, result) => {
        if (err) {return next(err);}

        User.findByIdAndUpdate(req.user._id, {$pull: {likedPosts: result._id}}).exec((err, eh) => {
            if (err) {return next(err);}

            Post.findByIdAndUpdate(result._id, {likes: result.likes - 1}).exec((err, result) => {
                if (err) {return next(err);}

                res.redirect(req.get('referer'));
            });
        });
    });
};


exports.addLike = (req, res, next) => {
    Post.findById(req.params.id).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$push: {likedPosts: result}}).exec((err, eh) => {
            if (err) {return next(err);}

            Post.findByIdAndUpdate(result._id, {likes: result.likes + 1}).exec((err, result) => {
                if (err) {return next(err);}

                res.redirect(req.get('referer'));
            });
        });
    });
};


exports.addPost = (req, res, next) => {
    let newPost = new Post({
        user: req.user,
        text: req.body.text,
        likes: 0,
        pic: req.body.pic ? req.body.pic : ""
    });

    console.log(req.body.pic);

    newPost.save((err, result) => {
        if (err) {return next(err);}

        res.redirect('/');
    });
};

exports.timeline = (req, res, next) => {
    if (!req.user) return res.redirect('/log-in');
    async.parallel({
        user(callback) {
            User.findById(req.user._id)
                .populate('receivedRequests')
                .populate('sentRequests')
                .populate('friends').exec(callback);
        },
        posts(callback) {
            Post.find().populate('user')
                .populate({path: 'comments', populate: {path: 'user',}})
                .populate({path: 'comments', populate: {path: 'replies', populate: {path: 'user'}}})
                .populate({path: 'comments', populate: {path: 'replies', populate: {path: 'replyingTo'}}})
                .sort([['date', -1]]).exec(callback);
        }
    }, (err, result) => {
        if (err) {return next(err);}
        res.render("index", {title: "Timeline", posts: result.posts, user: result.user});
    });
};