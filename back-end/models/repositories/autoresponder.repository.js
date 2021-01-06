const mongoose = require('mongoose');
const AutoResponder = require('../models/autoresponder.model');
const AutoResponderKeyword  =   require('../models/autoresponderkeyword.model');
const AutoresponderRepository   =   {
  /**
    * @CreateAutoResponderGroup
    * Get Auto-Responder Group As Per user_id
  */
 CreateAutoResponderGroup: async (data) => {
    try {
        let UserAutoResponder = await AutoResponder.create(data);
      return UserAutoResponder;
    } catch (e) {
      throw e;
    }
  },
  /**
    * @CreateAutoResponderKeyword
    * Get Auto-Responder Group As Per user_id and Autoresponder id
  */
 CreateAutoResponderKeyword: async (data) => {
    try {
        let UserAutoResponderKeyword = await AutoResponderKeyword.create(data);
      return UserAutoResponderKeyword;
    } catch (e) {
      throw e;
    }
  }
  ,
  /**
    * @GetAutoResponderResponder
    * Get Auto-Responder Group As Per user_id and Autoresponder id
  */
 GetAutoResponderResponder: async (autoUserId) => {
    try {
        return await AutoResponder.aggregate([
            {
              $match: {
                'user_id': mongoose.Types.ObjectId(autoUserId),
              }
            },
            {
              $lookup: {
                from: 'autoresponderkeywords',
                localField: '_id',
                foreignField: 'auto_responder_id',
                as: 'autoresponderkeywords'
              }
            },
            {
              $unwind: {
                path: '$autoresponderkeywords',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'users'
              }
            },
            {
              $group: {
                '_id': '$_id',
                auto_responder_name: {
                  $first: '$auto_responder_name'
                },
                auto_responder_details: {
                  $first: '$auto_responder_details'
                },
                message: {
                  $first: '$message'
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
                autoresponderkeywords: {
                  $push: '$autoresponderkeywords'
                },
                users: {
                  $first: '$users'
                }
              }
            }
          ]).exec();
    } catch (e) {
      throw e;
    }
 },
 /**
   * @GetAutoResponderKeywords
   * Get Auto-Responder Keywords As Per user_id
 */
GetAutoResponderKeywords: async (autoUserId) => {
   try {
       return await AutoResponderKeyword.aggregate([
           {
             $match: {
               'user_id': mongoose.Types.ObjectId(autoUserId),
             }
           },
           {
             $lookup: {
               from: 'autoresponders',
               localField: 'auto_responder_id',
               foreignField: '_id',
               as: 'autoresponders'
             }
           },
           {
             $group: {
               '_id': '$_id',
               keywords: {
                 $first: '$keywords'
               },
               createdAt: {
                 $first: '$createdAt'
               },
               updatedAt: {
                 $first: '$updatedAt'
               },
               autoresponders: {
                 $first: '$autoresponders'
               }
             }
           }
         ]).exec();
   } catch (e) {
     throw e;
   }
}

};

module.exports = AutoresponderRepository;