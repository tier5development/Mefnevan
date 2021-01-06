const UsersRepo = require('../../../models/repositories/user.repository');
module.exports.userFacebook = async (req, res) => {
    try {
        console.log("This is my sent",req.body);
        let userinfo=JSON.parse(req.body.token);
        console.log("this is the user info",userinfo.user.id);
        let UsersDetailinfo= {
            kyubi_user_token: userinfo.user.id,
            facebook_id: req.body.fb_id,
            facebook_name: req.body.fb_name,
            facebook_profile_name:req.body.fb_username,
            facebook_image:req.body.fb_image,
            status: 0
          };
        let getUserInfo = await UsersRepo.GetUserById(userinfo.user.id).then(async res=>{
            if(res){
                console.log(res);
                res.send({
                    code: 1,
                    message: "Data Stored Successfully",
                    payload: res
                });
            }else{
                await UsersRepo.saveUserDetails(UsersDetailinfo).then(result=>{
                    console.log(result);
                    res.send({
                        code: 1,
                        message: "Data Stored Successfully",
                        payload: result
                    });
                }).catch(error =>{
                    console.log(error);
                });
                //console.log("No result");
            }
            
        }).catch(async error=>{
            console.log(UsersDetailinfo);
            await UsersRepo.saveUserDetails(UsersDetailinfo).then(result=>{
                console.log(result);
                res.send({
                    code: 1,
                    message: "Data Stored Successfully",
                    payload: result
                });
            }).catch(error =>{
                console.log(error);
            });
            
            //console.log("No result Error",error);
        });
        //UsersRepo.GetUserById(userinfo.user.id)
            
        
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}

