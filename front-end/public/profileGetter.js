
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
            if(UserURL !== ""){
                UserFacebookUsername = UserURL;
            }else{
                console.log("Warning I am Not Getting Facebook UserName Please Fix Me !!!!");
            }
            let Name  =  $(".ca a").find("img").attr("alt");
            if(Name !== ""){
                let finame = Name.split(',');
                UserFacebookName  = finame[0];
            }else{
                console.log("Warning I am Not Getting Facebook Name Please Fix Me !!!!");
            }
            let fid =   $('input[name=target]').val();
            if(fid !== ""){
                UserFacebookid  = fid;

            }else{
                console.log("Warning I am Not Getting Facebook ID Please Fix Me !!!!");
            }
            let fimage =  $(".ca a").find("img").attr("src");
            if(fimage !== ""){
                UserFacebookImage  = fimage;
            }else{
                console.log("Warning I am Not Getting Facebook ID Please Fix Me !!!!");
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
    FacebookId : UserFacebookid,
    FacebookUsername : UserFacebookUsername,
    FacebookName : UserFacebookName,
    FacebookImage  : UserFacebookImage,
    LoggedInFacebook  : UserLoggedInFacebook
  }

console.log("This I got After Scraping ",parameters);
chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});