const UsersRepo = require('../../../models/repositories/user.repository');
module.exports.userFacebook = async (req, res) => {
    try {
        console.log("This is my sent",req.body);
        
        
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_rec);
        console.log("This is my Respo",getUserInfo);
        if(getUserInfo){
            
            let UpdateUserInfo=await UsersRepo.UpdateUser(req.body.user_rec,req.body.fb_id,req.body.fb_name,req.body.fb_username,req.body.fb_image);
            let getUserInfoNew = await UsersRepo.GetUserById(req.body.user_rec);
            res.send({
                code: 1,
                message: "Successfully User Added",
                payload: getUserInfoNew
            });
        }else{
            let UsersDetailinfo= {
                kyubi_user_token: req.body.user_rec,
                facebook_id: req.body.fb_id,
                facebook_name: req.body.fb_name,
                facebook_profile_name:req.body.fb_username,
                facebook_image:req.body.fb_image,
                status: 0
            };
            let saveUesr=await UsersRepo.saveUserDetails(UsersDetailinfo);
            res.send({
                code: 1,
                message: "Successfully User Added",
                payload: saveUesr
            });
        }
        //UsersRepo.GetUserById(userinfo.user.id)
            
        
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}

