const UsersRepo = require('../../../models/repositories/user.repository');
const UserSettingRepository =   require('../../../models/repositories/settings.repository');
const AutoResponderRepo =   require('../../../models/repositories/autoresponder.repository');
const cast = require('TypeCast');

module.exports.AutoResponderCreate  =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_id);
        if(getUserInfo._id){
            let UsersAutoResponderinfo={}
            if(req.body.autoreponder_message_type == "1"){
                 UsersAutoResponderinfo= {
                    user_id: getUserInfo._id,
                    auto_responder_name: req.body.auto_responder_name,
                    status:req.body.auto_responder_status,
                    type:req.body.autoreponder_message_type,
                    message_group:req.body.autoreponder_message_group,
                  };
            }else{
                 UsersAutoResponderinfo= {
                    user_id: getUserInfo._id,
                    auto_responder_name: req.body.auto_responder_name,
                    message:req.body.auto_responder_message,
                    status:req.body.auto_responder_status,
                    type:req.body.autoreponder_message_type,
                  };
            }
            
            let AutoResponderGroup=await AutoResponderRepo.CreateAutoResponderGroup(UsersAutoResponderinfo);

            console.log("This is my AutoresponderGroup",UsersAutoResponderinfo);
            req.body.auto_responder_keywords.map(async eachval =>{
                console.log("each Keyword",eachval.text);
                let UsersAutoResponderKeywordinfo= {
                    user_id: getUserInfo._id,
                    auto_responder_id: AutoResponderGroup._id,
                    keywords:eachval.text
                };
                await AutoResponderRepo.CreateAutoResponderKeyword(UsersAutoResponderKeywordinfo);
            })
            
            res.send({
                code: 1,
                message: "TheKeyWords Is Saved SuccessFully",
                payload: req.body
            })
        }else{
            res.send({
                code: 3,
                message: "There is a error in user",
                payload: req.body
            })
        }
        
    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}
module.exports.AutoResponderList    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body.user_id);
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_id);
        if(getUserInfo._id){
            let getUserSettings= await UserSettingRepository.GetUserSettingById(getUserInfo._id);
            let AutoResponderDetails= await AutoResponderRepo.GetAutoResponderResponder(getUserInfo._id);
            let statusArray = [];
            await AutoResponderRepo.GetAutoResponderKeywords(getUserInfo._id).then(async result=>{
                if(result.length>0){
                    await result.map(async individual => {
                        if(individual.autoresponders[0].status===1){
                            statusArray.push({keyword:individual.keywords, message:individual.autoresponders[0].message,autoresponder_id:individual.autoresponders[0]._id});
                        }                                    
                    })
                    console.log("this are=======================",statusArray);

                }
            });
            res.send({
                            code: 1,
                            message: "Successfull",
                            payload:{setting:getUserSettings,autokey:AutoResponderDetails,listkey:statusArray}
                    });
            
            
        }else{
            res.send({
                code: 4,
                message: "Sorry No Data Of Parent",
                payload: ""
            })
        }
        
    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}
module.exports.AutoResponderEdit    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let AutoResponderDetails= await AutoResponderRepo.GetAutoResponderResponderWithId(req.body.Id);
        if(AutoResponderDetails){
            res.send({
                code: 1,
                message: "Successfull",
                payload:AutoResponderDetails
            }); 
        }else{
            res.send({
                code: 4,
                message: "Sorry No Data Of Parent",
                payload: ""
            })
        }
        
    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}
module.exports.AutoResponderUpdate  =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let AutoResponderDetails= await AutoResponderRepo.GetAutoResponderResponderWithId(req.body.auto_responder_id);
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_id);
        if(AutoResponderDetails){
            
              let UsersAutoResponderinfo={}
            if(req.body.autoreponder_message_type == "1"){
                 UsersAutoResponderinfo= {
                    auto_responder_name: req.body.auto_responder_name,
                    status:req.body.auto_responder_status,
                    type:req.body.autoreponder_message_type,
                    message_group:req.body.edit_group_id,
                  };
            }else{
                 UsersAutoResponderinfo= {
                    auto_responder_name: req.body.auto_responder_name,
                    status:req.body.auto_responder_status,
                    message:req.body.auto_responder_message,
                    type:req.body.autoreponder_message_type,
                  };
            }
              let updateAutoResponder=await AutoResponderRepo.updateAutoResponderById(UsersAutoResponderinfo,req.body.auto_responder_id);
              let DeleteAssociatedKeywords=await AutoResponderRepo.DeleteAssociatedAutoResponderKeywords(req.body.auto_responder_id,getUserInfo._id);
              
                req.body.auto_responder_keywords.map(async eachval =>{
                    console.log("each Keyword",eachval.text);
                    let UsersAutoResponderKeywordinfo= {
                        user_id: getUserInfo._id,
                        auto_responder_id: req.body.auto_responder_id,
                        keywords:eachval.text
                    };
                    await AutoResponderRepo.CreateAutoResponderKeyword(UsersAutoResponderKeywordinfo);
                })
              res.send({
                code: 1,
                message: "Successfull",
                payload:updateAutoResponder
            });
        }
        

    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}
module.exports.AutoResponderUpdateStatus    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let AutoResponderDetails= await AutoResponderRepo.GetAutoResponderResponderWithId(req.body.autoresponder_id);
        if(AutoResponderDetails){
            let UsersAutoResponderinfo= {
                status:req.body.status
              };
            let updateAutoResponder=await AutoResponderRepo.updateAutoResponderById(UsersAutoResponderinfo,req.body.autoresponder_id);
              if(updateAutoResponder){
                res.send({
                    code: 1,
                    message: "Successfull",
                    payload:updateAutoResponder
                });
              }else{
                res.send({
                    code: 2,
                    message: "Error",
                    payload:"Error"
                });
              }
        }
    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}
module.exports.AutoResponderDelete    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let DeleteAssociatedAutoResponderKeywords= await AutoResponderRepo.DeleteAssociatedAutoResponderKeywords(req.body.Id,req.body.user_id);
        let DeleteAutoResponder= await AutoResponderRepo.DeleteAutoResponder(req.body.Id,req.body.user_id);
        if(DeleteAutoResponder){
            res.send({
                code: 1,
                message: "Successfull",
                payload:DeleteAutoResponder
            });
          }else{
            res.send({
                code: 2,
                message: "Error",
                payload:"Error"
            });
          }
    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}
module.exports.BackThrustAutoresponderTypeGroup =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        
        let UpdateAutoResponderGlobalFun= await AutoResponderRepo.UpdateAutoResponderGlobal();
        if(UpdateAutoResponderGlobalFun){
            res.send({
                code: 1,
                message: "Successfull",
                payload:UpdateAutoResponderGlobalFun
            });
          }else{
            res.send({
                code: 2,
                message: "Error",
                payload:"Error"
            });
          }
    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}