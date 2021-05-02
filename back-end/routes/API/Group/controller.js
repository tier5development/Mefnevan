
const   MessageGroup  =   require('../../../models/repositories/messagegroup.repository');
const   usersettings  =   require('../../../models/repositories/settings.repository');
const   AutoResponderRepo   =   require('../../../models/repositories/autoresponder.repository');
module.exports.createGroup = async (req, res) => {
    try {
        let mess="";
        let code=1;
        let messageGroup = [];
        //console.log("This is my sent",req.body);
        
        if(req.body.group_name !="" && req.body.user_id !=""  && req.body.BlockStorage !=""){
            let payload ={
                user_id:req.body.user_id,
                title:req.body.group_name,
                associate_blocks:req.body.BlockStorage
            }
            await MessageGroup.CreateMessageGroup(payload).then(async result=>{
                messageGroup=await MessageGroup.GetAllMessageGroup(req.body.user_id);
                mess="Group Created Successfully";
                code=1;
            }).catch(error=>{
                mess=error.message;
                code=2;
            });
            
            
            
            console.log("This is my GetAllMessageSegment",messageGroup);
        }else{
            mess="Group Create UnSuccessfull Due To Input";
            code=2;
        }
        
        //console.log("This is my message",mess);
        res.send({
            code: code,
            message: mess,
            payload: messageGroup
        })
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.listGroup  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        let messageGroup = [];
        if(req.body.user_id !=""  ){
            messageGroup=await MessageGroup.GetAllMessageGroup(req.body.user_id);
            mess="Group List Successfully";
            code=1;
        }else{
            mess="Group List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: messageGroup
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.editGroup  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        if(req.body.group_id !=""  ){
            MessageGroups=await MessageGroup.GetMessageGroup(req.body.group_id);
            mess="Segments List Successfully";
            code=1;
        }else{
            mess="Segments List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: MessageGroups
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.updateGroup  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        if(req.body.group_id_edit !=""  ){
            let payload ={
                title:req.body.group_name_edit,
                associate_blocks:req.body.BlockStorage
            }
            let updateMessageGroup=await MessageGroup.updateMessageGroupById(payload,req.body.group_id_edit);
            messageGroup=await MessageGroup.GetAllMessageGroup(req.body.user_id);
            //messageSegment=await MessageSegment.GetMessageSegment(req.body.sagment_id_edit);
            mess="Segments List Successfully";
            code=1;
        }else{
            mess="Segments List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: messageGroup
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.deleteGroup  =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let SettingCounts   =   "";
        let MessageDetails  =   "";
        let AutoresponderCount  =   0;
        let AutoResponderMessageDetails =   "";
        let code    =   1;
        await  usersettings.GetUserSettingById(req.body.user_id).then(results=>{
            if(results.default_message_group == req.body.group_id){
                SettingCounts   =   "This Group Is in Use as Default Message";
            }
        }).catch(error=>    {
            console.log("This is the setting Error",error);
        });

        await AutoResponderRepo.GetAutoResponderResponder(req.body.user_id).then(async results    =>  {
            
            await results.map(async eachval =>{
                console.log("This is the Autoresponder details",eachval.message_group);
                if(req.body.group_id == eachval.message_group){
                    AutoresponderCount = AutoresponderCount+1;
                }
            })
            if(AutoresponderCount   !=  0){
                AutoResponderMessageDetails =   "This Group Is In Use In "+AutoresponderCount+" AutoResponder";
            }
        }).catch(error  =>  {
            console.log("This is the setting Error",error);
        })

        if(SettingCounts    !=  ""){
            code    =   2;
            MessageDetails  =   MessageDetails+" "+SettingCounts+".";
        }
        if(AutoresponderCount   !=  0){
            code    =   2;
            MessageDetails  =   MessageDetails+" "+AutoResponderMessageDetails+".";
        }

        if(code ==2){
            MessageDetails  =   MessageDetails+" Please remove them before deleting.";
            res.send({
                code: 2,
                message: MessageDetails,
                payload: {}
            }) 
        }else{
            let DeleteSegments=await MessageGroup.DeleteGroup(req.body.group_id);
            res.send({
                code: 1,
                message: "Group is deleted successfully",
                payload: {}
            }) 
        }



        res.send({
            code: code,
            message: MessageDetails,
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