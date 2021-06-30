const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserDelaySettingsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    delay_setting: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    delay_time: {
        type: Number,
        default: 0
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
module.exports = mongoose.model('UserDelaySettings', UserDelaySettingsSchema);