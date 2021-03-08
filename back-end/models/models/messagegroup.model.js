const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageGroupsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    title: {
        type: String,
        default: null,
        required: true,
    },
    associate_blocks: [[]],
    is_active: {
         type: Boolean,
         default: true 
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
// create the model for MessageGroup and expose it to our app
module.exports = mongoose.model('MessageGroups', MessageGroupsSchema);