const mongoose = require('mongoose');
const FriendMessageTrack = require('../models/friendmessagetrack.model');

const FriendMessageTrackRepository   =   {
  /**
    * @GetFriendMessageTrack
    * Get user Friend Message Track As Per user_id
  */
  GetFriendMessageTrack: async (UserId,FriendId,AutoresponderId) => {
  try {
    let FriendMessageTrackInfo = await FriendMessageTrack.findOne({ 
              'user_id': mongoose.Types.ObjectId(UserId),
              'autoresponder_id': mongoose.Types.ObjectId(AutoresponderId),
              'facebook_id':FriendId
      }).exec();
    return FriendMessageTrackInfo;
  } catch (e) {
    throw e;
  }
  },
  /**
    * @saveFriendMessageTrack
    * save Friend Message Track Details in mongo db
  */
  saveFriendMessageTrack: async (data) => {
    try {
      let FriendMessageTrackInfo = await FriendMessageTrack.create(data);
      if (!FriendMessageTrackInfo) {
        return null;
      }
      return FriendMessageTrackInfo;
    } catch (e) {
      throw e;
    }
  },
  /**
  * @DeleteFriendMessageTrack
  * Delete Friend Message Tracke By ID
  */
  DeleteFriendMessageTrack: async (UserId,FriendId,AutoresponderId) => {
    try {
      let FriendMessageTrackDelete = await FriendMessageTrack.deleteMany({ 
      'user_id': mongoose.Types.ObjectId(UserId),
      'autoresponder_id': mongoose.Types.ObjectId(AutoresponderId),
      'facebook_id':FriendId 
      });
      return FriendMessageTrackDelete;
    } catch (e) {
      throw e;
    }
  },
  /**
  * @DeleteFriendMessageTrackByUserId
  * Delete Friend Message Tracke By ID
  */
   DeleteFriendMessageTrackByUserId: async (UserId) => {
    try {
      let FriendMessageTrackDelete = await FriendMessageTrack.deleteMany({ 
      'user_id': mongoose.Types.ObjectId(UserId)
      });
      return FriendMessageTrackDelete;
    } catch (e) {
      throw e;
    }
  }

  
};


module.exports = FriendMessageTrackRepository;