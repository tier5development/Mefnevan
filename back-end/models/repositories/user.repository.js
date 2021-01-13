const User = require('../models/users.model');

const UsersRepository   =   {
  /**
    * @GetUserById
    * Get user As Per _id
  */
 GetUserById: async (UserId) => {
    try {
      let UserInfo = await User.findOne({ 'kyubi_user_token': UserId }).exec();
      return UserInfo;
    } catch (e) {
      throw e;
    }
  },
    /**
    * @saveUserDetails
    * save User Details in mongo db
  */
 saveUserDetails: async (data) => {
    try {
      let UserInfo = await User.create(data);
      if (!UserInfo) {
        return null;
      }
      return UserInfo;
    } catch (e) {
      throw e;
    }
  },
  /**
    * @UpdateUser
    * update User Info
  */
 UpdateUser: async (userId, facebook_id,facebook_name,facebook_profile_name,facebook_image) => {
  try {
    let UpdateUserInfo = await User.updateOne({ kyubi_user_token: userId }, {facebook_id: facebook_id,
      facebook_name: facebook_name,
      facebook_profile_name:facebook_profile_name,
      facebook_image:facebook_image
    }).exec();
    // console.log("Already Associated with", ChatRoomUpdated);
    return UpdateUserInfo;
  } catch (error) {
    throw error;
  }
}
};

module.exports = UsersRepository;