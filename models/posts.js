var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const postSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User'},
    comments: [{type: Schema.Types.ObjectId, ref:'Comment'}],
    text: {type: String},
    likes: {type: Number},
    date: Date,
    pic: {type: String}
});

module.exports = mongoose.model('Post', postSchema);