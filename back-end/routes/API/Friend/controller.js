const   UsersRepo   =   require('../../../models/repositories/user.repository');
const   FriendsRepo =   require('../../../models/repositories/friends.repository');

module.exports.FriendsCreateOrUpdate    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserFacebookID(req.body.user_id,req.body.facebook_id);
        console.log("PrevData",FriendsInfo);
        if(FriendsInfo){
            console.log("Have Friends");
            let FriendsInfoPayload= {
                last_contact_incoming:req.body.last_contact_incoming
              };
              let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
        }else{
            console.log("No Friends");
            let FriendsInfoPayload= {
                user_id: req.body.user_id,
                facebook_id: req.body.facebook_id,
                last_contact_incoming:req.body.last_contact_incoming
              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            
        }
        res.send({
            code: 1,
            message: "Success",
            payload: req.body
        })
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.FriendsUpdate    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserFacebookID(req.body.user_id,req.body.facebook_id);
        if(FriendsInfo){
            console.log("Have Friends");
            let FriendsInfoPayload= {
                last_contact_outgoing:req.body.last_contact_outgoing,
                facebook_username:req.body.facebook_username,
                facebook_name:req.body.facebook_name
              };
              let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
        }else{
            console.log("No Friends");
            let FriendsInfoPayload= {
                user_id: req.body.user_id,
                facebook_id: req.body.facebook_id,
                last_contact_outgoing:req.body.last_contact_outgoing,
                facebook_username:req.body.facebook_username,
                facebook_name:req.body.facebook_name
              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            
        }
        res.send({
            code: 1,
            message: "Success",
            payload: req.body
        })
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.friendsDefaultMessageCheck   =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let codex  =  2;
        let  mess =  "Dont Send";
        let FriendsInfo = await FriendsRepo.GetUserByUserFacebookID(req.body.user_id,req.body.facebook_id);
        if(FriendsInfo){
            console.log(req.body.last_contact_outgoing);console.log(FriendsInfo.last_default_message_time);
            console.log("Have Friends");
            let FriendsInfoPayload= {
                facebook_username:req.body.facebook_username,
                facebook_name:req.body.facebook_name
              };
              let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
              if(FriendsInfo.last_default_message_time==0){
                codex=1;
                mess="send message";
              }else{
                timediff=(req.body.last_contact_outgoing - FriendsInfo.last_default_message_time)/ (60*60*1000);
                if(timediff>req.body.default_time_delay){
                    codex=1;
                    mess="send message"; 
                }else{
                    codex=timediff;
                    mess="Dont Send";
                }
              }
        }else{
            console.log("No Friends");
            let FriendsInfoPayload= {
                user_id: req.body.user_id,
                facebook_id: req.body.facebook_id,
                facebook_username:req.body.facebook_username,
                facebook_name:req.body.facebook_name
              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            if(saveFriendsInfo.last_default_message_time==0){
                codex=1;
                mess="send message";
              }else{
                

              }
        }
        res.send({
            code: codex,
            message: "Success",
            payload: mess
        })
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.friendsUpdateDefaut    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserFacebookID(req.body.user_id,req.body.facebook_id);
        if(FriendsInfo){
            console.log("Have Friends");
            let FriendsInfoPayload= {
                last_default_message_time:req.body.last_contact_outgoing,
                facebook_username:req.body.facebook_username,
                facebook_name:req.body.facebook_name
              };
              let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
        }else{
            console.log("No Friends");
            let FriendsInfoPayload= {
                user_id: req.body.user_id,
                facebook_id: req.body.facebook_id,
                last_default_message_time:req.body.last_contact_outgoing,
                facebook_username:req.body.facebook_username,
                facebook_name:req.body.facebook_name
              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            
        }
        res.send({
            code: 1,
            message: "Success",
            payload: req.body
        })
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}