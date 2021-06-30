const   UsersRepo   =   require('../../../models/repositories/user.repository');
const   FriendsRepo =   require('../../../models/repositories/friends.repository');
const   UserSettingRepository   =   require('../../../models/repositories/settings.repository');
const   MessageGroup    =   require('../../../models/repositories/messagegroup.repository');
const   MessageSegment  =   require('../../../models/repositories/messagesegment.repository');
const   AutoResponderRepo   =   require('../../../models/repositories/autoresponder.repository');
const   FriendMessageTrackRepository    =   require('../../../models/repositories/friendmessagetrack.repository');
const   DelayRepo   =   require('../../../models/repositories/delaysettings.repository');
var typecast = require('typecast');

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
module.exports.CheckFriendReadyToReciveDefaultMessage   =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let TimeNowTC=typecast(req.body.TimeNow, 'number')
        let a = new Date(TimeNowTC);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        let OnlyDate = date + ' ' + month + ' ' + year ;
        let KeywordParams={
            ChangeDate:OnlyDate,
            ChangeFirstName:req.body.FacebookFirstName,
            ChangeLastName:req.body.FacebookLastName
        }
        let getUserSettings= await UserSettingRepository.GetUserSettingById(req.body.MfenevanId);
        let sendOption = 0;
        if(getUserSettings){
            let FriendsInfo = await FriendsRepo.GetUserByUserFacebookID(req.body.MfenevanId,req.body.FriendFacebookId,req.body.FacebookUserId);
            if(FriendsInfo){
                
                  let FriendsInfoPayload= {
                    facebook_username:req.body.ProfileLink,
                    facebook_first_name:req.body.FacebookFirstName,
                    facebook_last_name:req.body.FacebookLastName
                  };
                let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
                if(FriendsInfo.last_default_message_time==0){
                    sendOption = 1;
                }else{
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Now before  casting",req.body.TimeNow);
                    let TimeNow=typecast(req.body.TimeNow, 'number')
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Now after  casting",TimeNow);
                    let timediff=(TimeNow - FriendsInfo.last_default_message_time)/ (60*60*1000);
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Difference",timediff);
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Delay",getUserSettings.default_time_delay);
                    if(timediff>getUserSettings.default_time_delay){
                        console.log("Increaessssssssssssssss")
                        sendOption = 1; 
                    }else{
                        console.log("ZZZZZZZZZZZZZZZZZZZZZ")
                        sendOption = 0;
                    }
                }
            }else{
                let FriendsInfoPayload= {
                    user_id: req.body.MfenevanId,
                    facebook_id: req.body.FriendFacebookId,
                    facebook_user_id:req.body.FacebookUserId,
                    facebook_username:req.body.ProfileLink,
                    facebook_first_name:req.body.FacebookFirstName,
                    facebook_last_name:req.body.FacebookLastName
                };
                let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
                sendOption = 1;
            }
        }else{
            sendOption = 0;  
        }
        if(sendOption==1 && getUserSettings.default_message==1){
            if(getUserSettings.default_message_type==0){
                let newText=getUserSettings.default_message_text.replace('{first_name}'," "+KeywordParams.ChangeFirstName);
                newText=newText.replace('{last_name}'," "+KeywordParams.ChangeLastName);
                newText=newText.replace('{date}'," "+KeywordParams.ChangeDate);
                newText=newText.replace('{Date}'," "+KeywordParams.ChangeDate);
                res.status(200).send({
                    code: 1,
                    message: "Succefully fetched random message from the selected group",
                    payload: {
                    message: newText
                    }
                })
            }else{
                if(getUserSettings.default_message_group!=""){
                    await MessageGroup.GetMessageGroup(getUserSettings.default_message_group).then(async resultGroup=>{
                        let TotalNumberofBlocks=resultGroup.associate_blocks.length;
                        let CointNum=Math.floor(Math.random() * TotalNumberofBlocks);
                        let randomBlock = resultGroup.associate_blocks[CointNum];
                        if(randomBlock.length>0){
                            let i = 0
                            let finalMessage = []
                            sendResponse = (data) =>{
                            res.status(200).send({
                                code: 1,
                                message: "Succefully fetched random message from the selected group",
                                payload: {
                                message: data
                                }
                            })
                            }
                            constructMessage(i,randomBlock,finalMessage,sendResponse,KeywordParams);
                            
                        }else{
                            res.status(200).send({
                                code: 2,
                                message: "UnSuccefully fetched random message from the selected group",
                                payload: { }
                            }) 
                        }
                    });
                }else{
                    res.status(200).send({
                        code: 2,
                        message: "UnSuccefully fetched random message from the selected group",
                        payload: {}
                    }) 
                }
            }
        }else{
            res.status(200).send({
                code: 2,
                message: "UnSuccefully fetched random message from the selected group",
                payload: {}
            }) 
        }
        
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
        let FriendsInfo = await FriendsRepo.GetUserByUserFacebookID(req.body.MfenevanId,req.body.FriendFacebookId);
        if(FriendsInfo){
        //     console.log(req.body.last_contact_outgoing);
        //     console.log(FriendsInfo.last_default_message_time);
        //     console.log("Have Friends");
            let FriendsInfoPayload= {
                facebook_username:req.body.facebook_username,
                facebook_name:req.body.facebook_name
              };
              let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
              if(FriendsInfo.last_default_message_time==0){
                codex=1;
                mess="send message";
              }else{
                timediff=(req.body.TimeNow - FriendsInfo.last_default_message_time)/ (60*60*1000);
                if(timediff>req.body.DefaultMessageTimeDelay){
                    codex=1;
                    mess="send message"; 
                }else{
                    codex=2;
                    mess="Dont Send";
                }
              }
        }else{
        //     console.log("No Friends");
            let FriendsInfoPayload= {
                user_id: req.body.MfenevanId,
                facebook_id: req.body.FriendFacebookId,
                facebook_username:req.body.ProfileLink,
                facebook_name:req.body.ProfileName
              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            if(saveFriendsInfo.last_default_message_time==0){
                codex=1;
                mess="send message";
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
module.exports.SaveLastMessageOutForFriend  =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserFacebookID(req.body.MfenevanId,req.body.FriendFacebookId,req.body.FacebookUserId);
        let Checkuser_id= req.body.MfenevanId;
        let Checkfacebook_id= req.body.FriendFacebookId;
        let Checkfacebook_user_id=req.body.FacebookUserId;
        let Checkfacebook_username=req.body.ProfileLink;
        let Checkfacebook_first_name=req.body.FacebookFirstName;
        let Checkfacebook_last_name=req.body.FacebookLastName;
        let Checklast_contact_outgoing=0;
        let Checklast_default_message=req.body.ResponseMessage;
        let Checklast_default_message_time=0;
        let Checkconnection_status=1;
        let FriendsInfoPayloadUpdate  = {};
        if(req.body.MessageSenderType =="last_default_message_time"){
            Checklast_default_message_time=req.body.ResponseTime;
            FriendsInfoPayloadUpdate  =   {
                user_id: Checkuser_id,
                facebook_id: Checkfacebook_id,
                facebook_user_id:Checkfacebook_user_id,
                facebook_username:Checkfacebook_username,
                facebook_first_name:Checkfacebook_first_name,
                facebook_last_name:Checkfacebook_last_name,
                last_default_message: Checklast_default_message,
                last_default_message_time:Checklast_default_message_time,
                connection_status: Checkconnection_status
            };
        }else{
            Checklast_contact_outgoing=req.body.ResponseTime;
            FriendsInfoPayloadUpdate  =   {
                user_id: Checkuser_id,
                facebook_id: Checkfacebook_id,
                facebook_user_id:Checkfacebook_user_id,
                facebook_username:Checkfacebook_username,
                facebook_first_name:Checkfacebook_first_name,
                facebook_last_name:Checkfacebook_last_name,
                last_contact_outgoing: Checklast_contact_outgoing,
                last_default_message: Checklast_default_message,
                connection_status: Checkconnection_status
            };
            // 'user_id': mongoose.Types.ObjectId(UserId),
            //     'autoresponder_id': mongoose.Types.ObjectId(AutoresponderId),
            //     'facebook_id':FriendId
            let getDelayInfo = await DelayRepo.GetUserSettingById(Checkuser_id);
            if(getDelayInfo){
                if(getDelayInfo.delay_setting == 1){
                    for (let count = 0; count < req.body.autoresponder_id.length; count++) {
                        let FriendMessageTrackInfo=await FriendMessageTrackRepository.GetFriendMessageTrack(Checkuser_id,Checkfacebook_user_id,req.body.autoresponder_id[count]);
                        if(FriendMessageTrackInfo){
            
                        }else{
                            let MessageTrack={
                            user_id:Checkuser_id,
                            autoresponder_id:req.body.autoresponder_id[count],
                            facebook_user_id:Checkfacebook_user_id,
                            facebook_id:Checkfacebook_id,
                            facebook_username:Checkfacebook_username,
                            facebook_first_name:Checkfacebook_first_name ,
                            facebook_last_name:Checkfacebook_last_name,
                            send_time:req.body.ResponseTime
                            }
                            await FriendMessageTrackRepository.saveFriendMessageTrack(MessageTrack)
                        }
                    }
                }
            }

            
        }
        if(FriendsInfo){
            let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayloadUpdate,FriendsInfo._id);
        }else{
            let FriendsInfoPayload= {
                user_id: Checkuser_id,
                facebook_id: Checkfacebook_id,
                facebook_user_id:Checkfacebook_user_id,
                facebook_username:Checkfacebook_username,
                facebook_first_name:Checkfacebook_first_name,
                facebook_last_name:Checkfacebook_last_name,
                last_contact_outgoing: Checklast_contact_outgoing,
                last_default_message: Checklast_default_message,
                last_default_message_time:Checklast_default_message_time,
                connection_status: Checkconnection_status
            };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
        }

        
        res.send({
            code: 1,
            message: "Successfull",
            payload: FriendsInfo
        })
        
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.friendsSaveLastMessageOut    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserFacebookID(req.body.MfenevanId,req.body.FriendFacebookId);
        if(FriendsInfo){
            if(req.body.DefaultMessageLastTime == 0){
                let FriendsInfoPayload= {
                    
                    facebook_id: req.body.FriendFacebookId,
                    facebook_username:req.body.ProfileLink,
                    facebook_name:req.body.ProfileName,
                    last_contact_outgoing:req.body.LastContactOutGoing
                  };
                  let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
                  let NewFriendInfo=await FriendsRepo.GetUserByUserFacebookID(req.body.MfenevanId,req.body.FriendFacebookId);
                    if(updateFriendsInfo){
                        res.send({
                            code: 1,
                            message: "Friends Last Outginng Message Saved",
                            payload: NewFriendInfo
                        })
                    }else{
                        res.send({
                            code: 1,
                            message: "Friends Last Outginng Message Saved With Error",
                            payload: NewFriendInfo
                        })
                    }
                }else{
                let FriendsInfoPayload= {
                    
                    facebook_id: req.body.FriendFacebookId,
                    facebook_username:req.body.ProfileLink,
                    facebook_name:req.body.ProfileName,
                    last_contact_outgoing:req.body.LastContactOutGoing,
                    last_default_message_time:req.body.DefaultMessageLastTime
    
                  };
                  let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
                  let NewFriendInfo=await FriendsRepo.GetUserByUserFacebookID(req.body.MfenevanId,req.body.FriendFacebookId);
                  if(updateFriendsInfo){
                    res.send({
                        code: 1,
                        message: "Friends Last Outginng Message Saved",
                        payload: NewFriendInfo
                    })
                    }else{
                        res.send({
                            code: 1,
                            message: "Friends Last Outginng Message Saved With Error",
                            payload: NewFriendInfo
                        })
                    }
                }
            
            
            
        }else{
            let FriendsInfoPayload= {
                user_id: req.body.MfenevanId,
                facebook_id: req.body.FriendFacebookId,
                facebook_username:req.body.ProfileLink,
                facebook_name:req.body.ProfileName,
                last_contact_outgoing:req.body.LastContactOutGoing,
                last_default_message_time:req.body.DefaultMessageLastTime

              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            if(saveFriendsInfo){
                res.send({
                    code: 1,
                    message: "Friends Last Outginng Message Saved",
                    payload: saveFriendsInfo
                })
            }else{
                res.send({
                    code: 1,
                    message: "Friends Last Outginng Message Saved With Error",
                    payload: saveFriendsInfo
                }) 
            }
        }

    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}

module.exports.fetchMessageGroupAndContents =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);

        await UserSettingRepository.GetUserSettingById(req.body.MfenevanId).then(async resultSettings=>{
            if(resultSettings.default_message_group!=""){
                console.log("This is my Setting Details",resultSettings);
                let RandomMessage="";
                await MessageGroup.GetMessageGroup(resultSettings.default_message_group).then(async resultGroup=>{
                    let TotalNumberofBlocks=resultGroup.associate_blocks.length;
                    let CointNum=Math.floor(Math.random() * TotalNumberofBlocks);
                    let randomBlock = resultGroup.associate_blocks[CointNum];
                    console.log("This is Random MessageGroup=====",randomBlock);
                    if(randomBlock.length>0){
                        let i = 0
                        let finalMessage = []
                        sendResponse = (data) =>{
                        res.status(200).send({
                            code: 1,
                            message: "Succefully fetched random message from the selected group",
                            payload: {
                            message: data
                            // data: randomSegment.segment_id.message_blocks[getRandomInt(0,randomSegment.segment_id.message_blocks.length -1)]
                            }
                        })
                        }
                        constructMessage(i,randomBlock,finalMessage,sendResponse);
                        
                    }
                });
                console.log("This is the final Message========================>",RandomMessage)
            }
        });
        
        

    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.checkAutoresponderMessageForGroup    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let AutoResponderDetails= await AutoResponderRepo.GetAutoResponderResponderWithId(req.body.autoresponder_id);
        //console.log("This is my Autoresponder",AutoResponderDetails[0]);
        let AllowedtosendMessage= await MessageCreatorTrack(req.body);
        if(AllowedtosendMessage == 1){
                let KeywordParams={
                    ChangeDate:req.body.OnlyDate,
                    ChangeFirstName:req.body.FriendFirstName,
                    ChangeLastName:req.body.FriendLastName
                }
                if(AutoResponderDetails[0].type == "1"){
                    await MessageGroup.GetMessageGroup(AutoResponderDetails[0].message_group).then(async resultGroup=>{
                        let TotalNumberofBlocks=resultGroup.associate_blocks.length;
                        let CointNum=Math.floor(Math.random() * TotalNumberofBlocks);
                        let randomBlock = resultGroup.associate_blocks[CointNum];
                        if(randomBlock.length>0){
                            let i = 0
                            let finalMessage = []
                            sendResponse = (data) =>{
                            res.status(200).send({
                                code: 1,
                                message: "Succefully fetched random message from the selected group",
                                payload: {
                                message: data
                                }
                            })
                            }
                            constructMessage(i,randomBlock,finalMessage,sendResponse,KeywordParams);
                            
                        }else{
                            res.status(200).send({
                                code: 2,
                                message: "UnSuccefully fetched random message from the selected group",
                                payload: { }
                            }) 
                        }
                    });
                    // res.send({
                    //     code: 1,
                    //     message: "Succefully fetched random message from the selected group1",
                    //     payload: {
                    //     message: AutoResponderDetails[0].message_group
                    //     }
                    // })  
                }else{
                    let newText=AutoResponderDetails[0].message.replace('{first_name}'," "+KeywordParams.ChangeFirstName);
                        newText=newText.replace('{last_name}'," "+KeywordParams.ChangeLastName);
                        newText=newText.replace('{date}'," "+KeywordParams.ChangeDate);
                        newText=newText.replace('{Date}'," "+KeywordParams.ChangeDate);
                    res.send({
                        code: 1,
                        message: "Succefully fetched random message from text",
                        payload: {
                        message: newText
                        }
                    })  
                }
        }else{
            res.status(200).send({
                code: 2,
                message: "UnSuccefully fetched random message from the selected group",
                payload: { }
            })     
        }
        
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
async function constructMessage(i,messageBlock,finalMessage,__callback,KeywordParams){
    if(messageBlock[i].type == "id"){
                let MessageSegmentDetails=await MessageSegment.GetMessageSegment(messageBlock[i].value);
                //         console.log("This is XXXXXXXXXXXXXXXX =====",MessageSegmentDetails);
                let TotalNumberofSegment=MessageSegmentDetails.message_blocks.length;
                //         console.log("This is XXXXXXXXXXXXXXXX =====",TotalNumberofSegment);
                let CointBlock =Math.floor(Math.random() * TotalNumberofSegment);
                //         console.log("This is XXXXXXXXXXXXXXXX =====",CointBlock);
                let randomSegments = MessageSegmentDetails.message_blocks[CointBlock];
                let newText=randomSegments.replace('{first_name}'," "+KeywordParams.ChangeFirstName);
                newText=newText.replace('{last_name}'," "+KeywordParams.ChangeLastName);
                newText=newText.replace('{date}'," "+KeywordParams.ChangeDate);
                newText=newText.replace('{Date}'," "+KeywordParams.ChangeDate);
                
        finalMessage.push(newText)
      }else{
        let newText=messageBlock[i].value.replace('{first_name}', KeywordParams.ChangeFirstName);
        newText=newText.replace('{last_name}'," "+KeywordParams.ChangeLastName);
        newText=newText.replace('{date}'," "+KeywordParams.ChangeDate);
        newText=newText.replace('{Date}'," "+KeywordParams.ChangeDate);
        finalMessage.push(newText)
      }
      i++
      if(i < messageBlock.length){
        constructMessage(i,messageBlock,finalMessage,__callback,KeywordParams)
      }else{
        //console.log("message",finalMessage.join(' '))
          return __callback(finalMessage.join(' '))
      }
    //return __callback(messageBlock);
}
async function MessageCreatorTrack(Restro){
    let getDelayInfo = await DelayRepo.GetUserSettingById(Restro.MfenevanId);
    let AllowedtosendMessage = 0;
    if(getDelayInfo){
        if(getDelayInfo.delay_setting == 1){
            let DelayTime=getDelayInfo.delay_time;
            console.log("Delay Minutes",DelayTime);
            let GetLastMessageTrack=await FriendMessageTrackRepository.GetFriendMessageTrack(Restro.MfenevanId,Restro.FriendFacebookId,Restro.autoresponder_id);
            if(GetLastMessageTrack){
                console.log("Last Message Time",GetLastMessageTrack.send_time);
                console.log("Now Time",Restro.TimeNow);
                let actualnumber=typecast.number(Restro.TimeNow)-typecast.number(GetLastMessageTrack.send_time);
                let minutes = Math.floor(actualnumber/1000/60);
                console.log("Difference",minutes);
                if(minutes>=DelayTime){  
                    console.log("Delete This Row =====",GetLastMessageTrack);
                    console.log("Delete This Row =====",GetLastMessageTrack._id);
                    await FriendMessageTrackRepository.DeleteFriendMessageTrack(Restro.MfenevanId,Restro.FriendFacebookId,Restro.autoresponder_id)
                    return 1;
                }else{
                    return 0;
                }
            }else{
                return 1; 
            }
            
        }else{
            return 1;
        }
    }else{
        return 1;
    }
}