var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    post: {type: Schema.Types.ObjectId, ref: 'Post'},
    text: {type: String},
    likes: {type: Number},
    date: Date
});

module.exports = mongoose.model('Comment', commentSchema);