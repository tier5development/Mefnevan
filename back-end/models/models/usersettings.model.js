const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSettingsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    default_message: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    autoresponder: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    timezone: {
        type: String,
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
// create the model for UserSettings and expose it to our app
module.exports = mongoose.model('UserSettings', UserSettingsSchema);