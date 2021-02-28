
console.log("I am in Profile JS ");
let UserFacebookUsername =  "";
let UserFacebookName    =   "";
let UserFacebookid  =   "";
let UserFacebookImage   =   "";
let UserLoggedInFacebook =  false;
let NavItem =$("nav").find("a");
let CheckCounter =0;
if(NavItem){
    console.log("I Got THIS Nav Items ",NavItem.length);
    if(NavItem.length  === 0){
        CheckCounter =0;
        UserLoggedInFacebook =  false;
    }else{
        NavItem.each( async function() {
            let  name = $(this).text();
            if(name === "Profile"){
                CheckCounter =CheckCounter+1;
            }
        })
        if(CheckCounter > 0){
            UserLoggedInFacebook =  true;
            let UserURL= $(".ca").find("a").attr("href");
            if(UserURL){
                let UserURLNo = UserURL.split('/');
                let UserURLMo = UserURLNo[1].split('?');
                UserFacebookUsername = UserURLMo[0];
            }else{
                let NewUserURL  =   $(".by").find("a").attr("href");
                if(NewUserURL){
                    let NewUserURLNo = NewUserURL.split('/');
                    let NewUserURLMo = NewUserURLNo[1].split('?');
                    UserFacebookUsername = NewUserURLMo[0];
                }else{
                    let NewUserURLNew  =   $(".bx").find("a").attr("href");
                    if(NewUserURLNew){
                        let NewUserURLNewNo = NewUserURLNew.split('/');
                        let NewUserURLNewMo = NewUserURLNewNo[1].split('?');
                        UserFacebookUsername = NewUserURLNewMo;
                    }else{
                        console.log("Warning I am Not Getting Facebook UserName Please Fix Me I AM bx !!!!");
                    }
                    console.log("Warning I am Not Getting Facebook UserName Please Fix Me I AM by !!!!");
                }
                console.log("Warning I am Not Getting Facebook UserName Please Fix Me I AM ca !!!!");
            }
            let Name  =  $(".ca a").find("img").attr("alt");
            if(Name){
                let finame = Name.split(',');
                UserFacebookName  = finame[0];
            }else{
                let NewName  =  $(".by a").find("img").attr("alt");
                if(NewName){
                    let finameNew = NewName.split(',');
                    UserFacebookName  = finameNew[0];
                }else{
                    let NewNameNew  =  $(".bx a").find("img").attr("alt");
                    if(NewNameNew){
                        let NewfinameNew = NewNameNew.split(',');
                        UserFacebookName  = NewfinameNew[0];
                    }else{
                        console.log("Warning I am Not Getting Facebook Name Please Fix Me I Am bx!!!!");
                    }
                    console.log("Warning I am Not Getting Facebook Name Please Fix Me I Am by!!!!");
                }
                console.log("Warning I am Not Getting Facebook Name Please Fix Me I AM ca!!!!");
            }
            let fid =   $('input[name=target]').val();
            if(fid){
                UserFacebookid  = fid;

            }else{
                console.log("Warning I am Not Getting Facebook ID Please Fix Me !!!!");
            }
            let fimage =  $(".ca a").find("img").attr("src");
            if(fimage){
                UserFacebookImage  = fimage;
            }else{
                let Newfimage =  $(".by a").find("img").attr("src");
                if(Newfimage){
                    UserFacebookImage  = Newfimage;
                }else{
                    let NewfimageNew =  $(".bx a").find("img").attr("src");
                    if(NewfimageNew){
                        UserFacebookImage  = NewfimageNew;
                    }else{
                        console.log("Warning I am Not Getting Facebook ID Please Fix Me  I AM bx!!!!");
                    }
                    console.log("Warning I am Not Getting Facebook ID Please Fix Me  I AM by!!!!");
                }
                console.log("Warning I am Not Getting Facebook ID Please Fix Me I Am ca!!!!");
            }
          
        }else{
            UserLoggedInFacebook =  false;
        }
    }   
}else{
    UserLoggedInFacebook =  false;
    console.log("I Did Not Got THIS Nav Items ",NavItem);
}

let parameters={
    fb_id : UserFacebookid,
    fb_username : UserFacebookUsername,
    fb_name : UserFacebookName,
    fb_image  : UserFacebookImage,
    fb_logged_id  : UserLoggedInFacebook
  }

console.log("This I got After Scraping ",parameters);
chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});