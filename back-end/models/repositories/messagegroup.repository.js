const mongoose = require('mongoose');
const MessageGroup    =   require('../models/messagegroup.model');
const MessageGroupRepository   =   {
/**
* @CreateMessageGroup
* Get MessageGroup As Per user_id
*/
 CreateMessageGroup: async (data) => {
    try {
        let UserMessageGroup = await MessageGroup.create(data);
      return UserMessageGroup;
    } catch (e) {
      throw e;
    }
  },
/**
* @getAllMessageGroup
* get the Group info by a specified field from Mongo DB
*/
GetAllMessageGroup: async (id) => {
    try {
      let MessageGroupInfo = await MessageGroup.find({ 'user_id': mongoose.Types.ObjectId(id) }).exec();
      return MessageGroupInfo;
    } catch (e) {
      throw e;
    }
  },
  /**
  * @getMessageGroup
  * get the Group info by a specified field from Mongo DB
  */
   GetMessageGroup: async (id) => {
      try {
        let MessageGroupInfo = await MessageGroup.findOne({ '_id': mongoose.Types.ObjectId(id) }).exec();
        return MessageGroupInfo;
      } catch (e) {
        throw e;
      }
    },
    /**
    * @updateMessageGroupById
    * update MessageGroup BY Id
    */
    updateMessageGroupById: async (data, id) => {
      try {
        let updateMessageGroup = await MessageGroup.findByIdAndUpdate(id, data, {
          new: true,
          upsert: true
        }).exec();
        return updateMessageGroup;
      } catch (e) {
        throw e;
      }
    },
    /**
    * @CheckMessageSegmentPresentInGroup
    * Check Message Segment Present In Group BY Segment Id
    */
    CheckMessageSegmentPresentInGroup:  async (SegmentId) =>  {
      try {
        let MessageGroupInfo = await MessageGroup.find( { 
                                                          "associate_blocks": {   
                                                                                "$elemMatch":{ 
                                                                                  "value": SegmentId 
                                                                                } 
                                                                              }
                                                        } ).exec();
        return MessageGroupInfo;
      } catch (e) {
        throw e;
      }
    }

}

module.exports = MessageGroupRepository;