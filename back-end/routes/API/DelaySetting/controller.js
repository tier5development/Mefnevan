const   UsersRepo   =   require('../../../models/repositories/user.repository');
const   DelayRepo   =   require('../../../models/repositories/delaysettings.repository');
const   UserHelper  =   require('../../../Helpers/usersHelper');
const   FriendMessageTrackRepository    =   require('../../../models/repositories/friendmessagetrack.repository');
const cast = require('TypeCast');


module.exports.getSetting = async (req, res) => {
    try {
        console.log("This is my sent",req.body.user_id);
        let getUserInfo = await DelayRepo.GetUserSettingById(req.body.user_id);
        let code =0;
        let message="";
        let payload=[];
        if(getUserInfo){
            code=1;
            payload=getUserInfo;
        }else{
            code=2;
            message="Sorry the Is No Data For The User";
        }
                res.send({
                    code: code,
                    message: message,
                    payload:payload
                });      
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.setSetting = async (req, res) => {
    try {
        console.log("This is my sent",req.body);
        let delayHrs=cast.number(req.body.delay_hrs)*60;
        let delayMins=cast.number(req.body.delay_minute);
        let delayStatus=0;
        if(req.body.delay_status == true){
           delayStatus=1;
        }else{
           delayStatus=0;
            await FriendMessageTrackRepository.DeleteFriendMessageTrackByUserId(req.body.user_id);
        }
        
        let totalTime=delayHrs+delayMins;
        let getUserInfo = await DelayRepo.GetUserSettingById(req.body.user_id);
        let code =0;
        let message="";
        let payload=[];
        
        if(getUserInfo){
            code=1;
            await DelayRepo.UpdateUserSettingsLoad(getUserInfo._id,delayStatus,totalTime);
            payload=await DelayRepo.GetUserSettingById(req.body.user_id);
            message="Setting Saved Successful";
        }else{
            code=1;
            let load={
                user_id: req.body.user_id,
                delay_setting:delayStatus,
                delay_time: totalTime
                }
                console.log("Try To Store This",load);
           let saveSettings= await DelayRepo.saveUserSettingsDetails(load);
           payload=saveSettings;
           message="Setting Saved Successful";
        }
        res.send({
            code: code,
            message: message,
            payload: payload
        })
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}