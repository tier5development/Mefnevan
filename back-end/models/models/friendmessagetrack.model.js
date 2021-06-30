const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendMessageTrackSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    autoresponder_id: {
        type: Schema.Types.ObjectId,
        ref: 'AutoResponders',
        default: null
    },
    facebook_user_id: {
        type: Number,
        default: 0
    },
    facebook_id: {
        type: Number,
        default: 0
    },
    facebook_username: {
        type: String,
        default: ''
    },
    facebook_first_name: {
        type: String,
        default: ''
    },
    facebook_last_name: {
        type: String,
        default: ''
    },
    send_time: {
        type: Number,
        default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    }
});
// create the model for Friends and expose it to our app
module.exports = mongoose.model('FriendMessageTrack', FriendMessageTrackSchema);