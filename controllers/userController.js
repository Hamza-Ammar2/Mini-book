var Post = require('../models/posts');
var User = require('../models/users');
var Comment = require('../models/comments');
var async = require('async');



exports.about = (req, res, next) => {
    if (!req.user) return res.redirect('/log-in');

    User.findById(req.params.id).exec((err, result) => {
        if (err) return next(err);

        res.render("user-about", {title: 'About', user: req.user, person: result});
    });
};




exports.editPic = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findByIdAndUpdate(req.user._id, {pic: req.body.pic}).exec((err, result) => {
        if (err) {return next(err);}

        res.redirect(req.get('referer'));
    });
};


exports.editResidence = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findByIdAndUpdate(req.user._id, {residence: req.body.residence}).exec((err, result) => {
        if (err) {return next(err);}

        res.redirect(req.get('referer'));
    });
};



exports.editWorkplace = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findByIdAndUpdate(req.user._id, {workplace: req.body.workplace}).exec((err, result) => {
        if (err) {return next(err);}

        res.redirect(req.get('referer'));
    });
};


exports.editBio = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findByIdAndUpdate(req.user._id, {bio: req.body.bio}).exec((err, result) => {
        if (err) {return next(err);}

        res.redirect(req.get('referer'));
    });
};

exports.unfriend = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findByIdAndUpdate(req.params.id, {$pull: {friends: req.user._id}}).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$pull: {friends: result._id}}).exec((err, result) => {
            if (err) {return next(err);}
            res.redirect(req.get('referer'));
        });
    });
};



exports.addFriend = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findByIdAndUpdate(req.params.id, {$pull: {sentRequests: req.user._id}, $push: {friends: req.user}}).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$pull: {receivedRequests: result._id}, $push: {friends: result}}).exec((err, result) => {
            if (err) {return next(err);}
            res.redirect(req.get('referer'));
        }); 
    });
};

exports.rejectFriend = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findByIdAndUpdate(req.params.id, {$pull: {sentRequests: req.user._id}}).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$pull: {receivedRequests: result._id}, $push: {friends: result}}).exec((err, result) => {
            if (err) {return next(err);}
            res.redirect(req.get('referer'));
        }); 
    });
};


exports.removeRequest = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findByIdAndUpdate(req.params.id, {$pull: {receivedRequests: req.user._id}}).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$pull: {sentRequests: result._id}}).exec((err, result) => {
            if (err) {return next(err);}
            res.redirect(req.get('referer'));
        });
    });
};


exports.sendRequest = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findByIdAndUpdate(req.params.id, {$push: {receivedRequests: req.user}}).exec((err, result) => {
        if (err) {return next(err);}
        User.findByIdAndUpdate(req.user._id, {$push: {sentRequests: result}}).exec((err, result) => {
            if (err) {return next(err);}
            res.redirect(req.get('referer'));
        });
    });
};


exports.allusers = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.find().exec((err, result) => {
        if (err) {return next(err);}
        res.render("allusers", {users: result, user: req.user});
    });
};


exports.userTimeline = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    async.parallel({
        user(callback) {
            User.findById(req.params.id).populate('friends').exec(callback);
        },
        posts(callback) {
            Post.find().populate('user')
                .populate({path: 'comments', populate: {path: 'user'}})
                .populate({path: 'comments', populate: {path: 'replies', populate: {path: 'user'}}})
                .populate({path: 'comments', populate: {path: 'replies', populate: {path: 'replyingTo'}}})
                .exec(callback);
        }
    }, (err, result) => {
        if (err) {return next(err);}
        let posts = [];
        result.posts.forEach(post => {
            if (post.user.username === result.user.username) {
                posts.push(post)
            } else {
                result.user.friends.forEach(user => {
                    if (user.username === post.user.username) return posts.push(post);
                });
            }
        });

        res.render("user", {title: result.user.username, person: result.user, posts: posts, user: req.user});
    });
};

exports.userFriends = (req, res, next) => {
    if (!req.user) {return res.redirect('/log-in');}
    User.findById(req.params.id).populate('friends').exec((err, result) => {
        if (err) {return next(err);}
        res.render("user-friends", {title: result.username, person: result, user: req.user});
    });
};