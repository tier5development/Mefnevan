
//console.log("I am in Profile JS ");
chrome.runtime.sendMessage({type: "OverlayTriggerIndividual", options: "MessageIndividual"});
let UserFacebookUsername =  "";
let UserFacebookName    =   "";
let UserFacebookid  =   "";
let UserFacebookImage   =   "";
let UserLoggedInFacebook =  false;
let NavItem =$("nav").find("a");
let CheckCounter =0;
var LocationDetails =window.location;
//console.log("This is the Location Details",LocationDetails);
if(NavItem){
    //console.log("I Got THIS Nav Items ",NavItem.length);
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
            UserFacebookid  =$('input[name=target]').val();
            let FormBox = $('#mbasic_inline_feed_composer').find('form').find('table').find('tbody').find('tr');
            //console.log("I Got THIS Table ",FormBox);
            FormBox.each(async function(i){
                if(i === 0){
                    let UserURL =$(this).find('td').find('div').find('a').attr('href');
                    let UserURLNo = UserURL.split('/');
                    let UserURLMo = UserURLNo[1].split('?');
                    UserFacebookUsername = UserURLMo[0];
                    let Name    =   $(this).find('td').find('div').find('a').find('img').attr('alt');
                    let finame = Name.split(',');
                    UserFacebookName  = finame[0];
                    UserFacebookImage   =   $(this).find('td').find('div').find('a').find('img').attr('src');
                    
                }
                

            })
          
        }else{
            UserLoggedInFacebook =  false;
        }
    }   
}else{
    UserLoggedInFacebook =  false;
    //console.log("I Did Not Got THIS Nav Items ",NavItem);
}

let parameters={
    FacebookId : UserFacebookid,
    FacebookUsername : UserFacebookUsername,
    FacebookName : UserFacebookName,
    FacebookImage  : UserFacebookImage,
    LoggedInFacebook  : UserLoggedInFacebook
  }

//console.log("This I got After Scraping ",parameters);
chrome.runtime.onMessage.addListener(async function(request, sender) {
    //console.log("This is the Request  From BackGround",request)
    if(request.type =="OverlayCreate"){
        //console.log("This issssssssssssssssssssssssssssss")
        var div=document.createElement("div");
        var textDiv =document.createElement("div");
        var imgURL = chrome.extension.getURL('images/128X128.png');
        div.style.width= "100%";
        div.style.height= "100%";
        div.style.position= "absolute";
        div.style.zIndex = "10000";
        div.style.background= "rgba(235,239,242,0.85)";
        div.style.isplay= "flex";
        div.style.flexWrap= "wrap";
        div.style.alignContent= "center";
        div.style.justifyContent= "center";
        div.style.position = 'fixed';
        div.style.top = '0';
        div.style.left = '0';
        var img = document.createElement("IMG");
        img.src = imgURL;
        img.style.position= "fixed";
        img.style.top= "50%";
        img.style.left= "50%";
        img.style.transform= "translate(-50%, -50%)";
        textDiv.innerHTML="MeFn Evan Is Using This Tab Please Don`t Close It";
        textDiv.style.top= "70%";
        textDiv.style.left= "27%";
        textDiv.style.position = 'fixed';
        textDiv.style.width= "100%";
        textDiv.style.fontSize="41px";
        textDiv.style.color= "#057ed9";
        div.appendChild(img);
        div.appendChild(textDiv);
        document.body.appendChild(div); 
    }
})
chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});