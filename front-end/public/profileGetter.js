
//console.log("I am in Profile JS ");
let UserFacebookid = "";
let UserFacebookUsername  = "";
let UserFacebookName  = "";
let UserFacebookImage = "";
let UserLoggedInFacebook  = false;
//console.log("UserKyubiToken =====>",$('#mbasic_inline_feed_composer').length);
// console.log("WindowId =====>",WindowId);
// console.log("TabId =====>",TabId);
if($('#mbasic_inline_feed_composer').length){
    //console.log("User IS Logged In");
    let UserURL= $(".ca").find("a").attr("href");
    //console.log("User IS Logged In",UserURL);
    UserURL = UserURL.substring(1, UserURL.length);
    UserURL = UserURL.split('?');
    let FacebookName  =  $(".ca a").find("img").attr("alt");
    FacebookName  = FacebookName.split(',');
    UserFacebookid  = $('input[name=target]').val();
    UserFacebookUsername  = UserURL[0];
    UserFacebookName  = FacebookName[0];
    UserFacebookImage  =  $(".ca a").find("img").attr("src");
    UserLoggedInFacebook  = true;
}else{
    //console.log("User IS Not Logged In");
    UserFacebookid="";
    UserFacebookUsername="";
    UserFacebookName="";
    UserFacebookImage="";
    UserLoggedInFacebook=false;
}
let parameters={
    
    fb_id : UserFacebookid,
    fb_username : UserFacebookUsername,
    fb_name : UserFacebookName,
    fb_image  : UserFacebookImage,
    fb_logged_id  : UserLoggedInFacebook,
    
  }
  chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});