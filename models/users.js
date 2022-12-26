var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String},
    password: {type: String},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    sentRequests: [{type: Schema.Types.ObjectId, ref: 'User'}],
    receivedRequests: [{type: Schema.Types.ObjectId, ref: 'User'}],
    likedPosts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    pic: {type: String},
    workplace: {type: String},
    residence: {type: String},
    bio: {type: String}
});

module.exports = mongoose.model('User', userSchema);