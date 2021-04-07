///console.log("I am in in Individual JS ",window.location.search);
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
let port = chrome.runtime.connect({name: "knockknock"});
let WindowURL=window.location.search;
var LocationDetails =window.location;
let newWindowURL=WindowURL.replace('?tid=cid.c.', ' ');
newWindowURL=newWindowURL.replace('?tid=cid.g.', ' ');
let reslinksplit = newWindowURL.split("&");
let FacebookIdString  = reslinksplit[0].split("%3A");
//console.log("This are Facebook User Details",FacebookIdString);
if($("#messageGroup  > div").length  > 0){
    console.log("I am Hear to  Check the Message");
    let valll =$("#messageGroup  > div").last().find(' > div').length;
    let newel =$("#messageGroup  > div").last().find(' > div:nth-child('+valll+')').html();
    let divlet =$("#messageGroup  > div").last().find(' > div:nth-child('+valll+')').find(' > div:nth-child('+1+')').length;
    let divlethtml =$("#messageGroup  > div").last().find(' > div:nth-child('+valll+')').find(' > div:nth-child('+1+')').html();

    let lengthv =$("#messageGroup  > div").length;
    console.log("I am Hear to  Check the Message",valll);
    console.log("I am Hear to  Check the Message",lengthv);
    console.log("I am Hear to  Check the Message",newel);
    console.log("I am Hear to  Check the Message",divlet);
    console.log("I am Hear to  Check the Message",divlethtml);
    if(divlet !=0){
      let ProfileLink=$("#messageGroup  > div").last().find(' > div:nth-child('+valll+')').find(' > div:nth-child('+1+')').children('a').attr("href");
      let  Name=$("#messageGroup  > div").last().find(' > div:nth-child('+valll+')').find(' > div:nth-child('+1+')').children('a').children('strong').html();
      let ProfileName=Name.trim();
      console.log("I am Hear to  Check the Message",ProfileLink);
      console.log("I am Hear to  Check the Message",Name);
      let content=" ";
      $("#messageGroup  > div").last().find(' > div:nth-child('+valll+')').find(' > div:nth-child('+1+')').find('div').find('span').each( async function(ThisCountElem) { 
        console.log("Tis Chunk", $(this).html());
        content = content + " " +$(this).html();
      });
      console.log("Tis  Total Chunk", content);
      let MessageDetails = {
        profile_name:ProfileName,
        message_content:content,
        facebook_Id:FacebookIdString,
        location_details:LocationDetails.href,
        ProfileLink:ProfileLink
      }
      console.log("Total INFO Is -------",MessageDetails);
      //chrome.runtime.sendMessage({type: "CheckMessageContent", options: MessageDetails});
      port.postMessage({MessageDetails: MessageDetails,ConFlag:"CheckMessageContent"});
    }else{
      console.log("Clear the CheckMessageREAD")
    }
    
}else{
  console.log("Clear the CheckMessageREAD")
}
chrome.runtime.onMessage.addListener(async function(request, sender) {
  console.log("This is the Request  From Contentsssssssssssss",request)
})
port.onMessage.addListener(async function(msg) {
  console.log("This is the Request  From CCCCCCCCCCCCCCCCCCCCCC",msg)
  if (msg.ConFlagBack == "DEFAULTMESSAGEBACK"){
    $('#composerInput').val(msg.userInfoDetails);
    $( "#composer_form" ).submit();
    //console.log("RESPONSE To USER With Default Message",msg.userInfoDetails);
    let Nowtime=$.now();
        
        let setDefaultMessageSaveONEX={
          FacebookFirstName: msg.ThreadParams.FacebookFirstName,
          FacebookLastName: msg.ThreadParams.FacebookLastName,
          FacebookUserId: msg.ThreadParams.FacebookUserId,
          FriendFacebookId: msg.ThreadParams.FriendFacebookId,
          MfenevanId: msg.ThreadParams.MfenevanId,
          ProfileLink: msg.ThreadParams.ProfileLink,
          ResponseMessage: msg.userInfoDetails,
          ResponseTime:Nowtime,
          MessageSenderType:"last_default_message_time",
          LocationDetails:LocationDetails.href
          };
        console.log("RESPONSE To Save  and Close With Link",setDefaultMessageSaveONEX);
        port.postMessage({MessageDetails: setDefaultMessageSaveONEX,ConFlag:"STOREANDCLOSE"});
  }
  if (msg.ConFlagBack == "AUTOMESSAGEBACK"){
    $('#composerInput').val(msg.userInfoDetails);
    $( "#composer_form" ).submit();
    console.log("RESPONSE To USER With AutoResponder Message",msg.userInfoDetails);
    
    let Nowtime=$.now();
        let setDefaultMessageSaveONEX={
        FacebookFirstName: msg.ThreadParams.FacebookFirstName,
        FacebookLastName: msg.ThreadParams.FacebookLastName,
        FacebookUserId: msg.ThreadParams.FacebookUserId,
        FriendFacebookId: msg.ThreadParams.FriendFacebookId,
        MfenevanId: msg.ThreadParams.MfenevanId,
        ProfileLink: msg.ThreadParams.ProfileLink,
        ResponseMessage: msg.userInfoDetails,
        ResponseTime:Nowtime,
        MessageSenderType:"last_contact_outgoing",
        LocationDetails:LocationDetails.href
        };
        console.log("RESPONSE To Save  and Close With Link",msg);
        port.postMessage({MessageDetails: setDefaultMessageSaveONEX,ConFlag:"STOREANDCLOSE"});
  }
})