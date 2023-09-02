var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    replyingTo: {type: Schema.Types.ObjectId, ref: 'User'},
    text: {type: String},
    likes: {type: Number},
    date: Date
});

module.exports = mongoose.model('Reply', replySchema);