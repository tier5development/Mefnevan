const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoResponderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    type: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    auto_responder_name: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    message_group: {
        type: Schema.Types.ObjectId,
        ref: 'MessageGroups',
        default: null
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1]
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
// create the model for AutoResponder and expose it to our app
module.exports = mongoose.model('AutoResponders', AutoResponderSchema);