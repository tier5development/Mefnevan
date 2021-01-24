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
  },
  GetUserDetailsInfo: async (Kyubi_User_Id) =>  {
    try {
      return await User.aggregate([
          
          {
            $lookup: {
              from: 'usersettings',
              localField: '_id',
              foreignField: 'user_id',
              as: 'usersettings'
            }
          },
          {
            $unwind: {
              path: '$usersettings',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
              'kyubi_user_token': Kyubi_User_Id
            }
          },
          {
            $group: {
              '_id': '$_id',
              kyubi_user_token: {
                $first: '$kyubi_user_token'
              },
              facebook_id: {
                $first: '$facebook_id'
              },
              facebook_name: {
                $first: '$facebook_name'
              },
              facebook_profile_name: {
                $first: '$facebook_profile_name'
              },
              facebook_image: {
                $first: '$facebook_image'
              },
              image_url: {
                $first: '$image_url'
              },
              status: {
                $first: '$status'
              },
              createdAt: {
                $first: '$createdAt'
              },
              updatedAt: {
                $first: '$updatedAt'
              },
              usersettings: {
                $first: '$usersettings'
              }
            }
          }
        ]).exec();
  } catch (e) {
    throw e;
  }
  }
};

module.exports = UsersRepository;