const mongoose = require('mongoose');
const UserDelaySetting = require('../models/userdelaysettings.model');

const UserDelaySettingRepository   =   {
  /**
    * @GetUserSettingById
    * Get user Setting As Per user_id
  */
 GetUserSettingById: async (UserId) => {
    try {
      let UserDelaySettingInfo = await UserDelaySetting.findOne({ 'user_id': mongoose.Types.ObjectId(UserId) }).exec();
      return UserDelaySettingInfo;
    } catch (e) {
      throw e;
    }
  },
    /**
    * @saveUserSettingsDetails
    * save User Setting Details in mongo db
  */
 saveUserSettingsDetails: async (data) => {
    try {
      let UserDelaySettingInfo = await UserDelaySetting.create(data);
      if (!UserDelaySettingInfo) {
        return null;
      }
      return UserDelaySettingInfo;
    } catch (e) {
      throw e;
    }
  },


/**
  * @UpdateUserSettingsById
  * update User Settings BY Id
*/
UpdateUserSettingsLoad: async (userId,delayStatus,delayTime) => {
  try {
    let UserDelaySettingInfo = await UserDelaySetting.updateOne({ _id:mongoose.Types.ObjectId(userId)  }, {
      delay_setting:delayStatus,
      delay_time:delayTime
  }).exec();
  return UserDelaySettingInfo;
  } catch (e) {
    throw e;
  }
  }
  
};


module.exports = UserDelaySettingRepository;