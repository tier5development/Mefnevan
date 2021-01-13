chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var jwt =request.data.userToken;
    var tokens = jwt.split(".");
  if(request.catch === "get-login-info"){

    if( $('#m_login_email').length && $('#m_login_email').length)         // use this if you are using id to check
    { 
        let data={
            token:atob(tokens[1]),
            fb_id:"",
            fb_username:"",
            fb_name:"",
            fb_image:"",
            fb_logged_id : false
            }
        //console.log("HIIIIIIIIIII",data);
        chrome.runtime.sendMessage({type: "storeUserInfo", options: data});
    }else{
        let fid=$('input[name=target]').val();
        let testurl= $(".ca").find("a").attr("href");
        testurl = testurl.substring(1, testurl.length);
        testurl=testurl.split('?');
        let imageUrl  =  $(".ca a").find("img").attr("src");
        let FBname  =  $(".ca a").find("img").attr("alt");
        FBname=FBname.split(',');
        let data={
        token:atob(tokens[1]),
        fb_id:fid,
        fb_username:testurl[0],
        fb_name:FBname[0],
        fb_image:imageUrl,
        fb_logged_id : true
        }
        //console.log("HELLLLLLOOOOO",data);
        chrome.runtime.sendMessage({type: "storeUserInfo", options: data});
    }
  }
})