//console.log("I am in in Individual JS ",window.location.search);
let WindowURL=window.location.search;
let newWindowURL=WindowURL.replace('?tid=cid.c.', ' ');
newWindowURL=newWindowURL.replace('?tid=cid.g.', ' ');
let reslinksplit = newWindowURL.split("&");
let FacebookIdString  = reslinksplit[0].split("%3A");
let port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({UserAndFriendId: FacebookIdString,ConFlag:"INDVAL"});
port.onMessage.addListener(async function(msg) {
    if (msg.ConFlagBack == "INDVALBACK"){
        //console.log("I am Getting this =+>>>>>>>>>>>>>>>>",msg.userInfoDetails);
        let  ProfileLink  = "";
        let ProfileName = "";
        let content =  "";
        let FaceBookUsername=msg.userInfoDetails.FaceBookUsername;
        let AutoResponderKeyword=msg.userInfoDetails.AutoResponderKeyword;
        let DefaultMessageState=msg.userInfoDetails.DefaultMessageState;
        let IsFaceBookLoggedIn=msg.userInfoDetails.IsFaceBookLoggedIn;
        let AutoresponderStatus=msg.userInfoDetails.AutoresponderStatus;
        let FacebooKFriendId=msg.userInfoDetails.FacebooKFriendId.trim();
        let FacebookUserId=msg.userInfoDetails.FacebookUserId.trim();
        let MfenevanId=msg.userInfoDetails.MfenevanId.trim();
        let Nowtime=$.now();
        if($('#messageGroup').find('div').find('.e').length  > 0){
            let TotalChunks=$('#messageGroup').find('div').find('.e').length
            $('#messageGroup').find('div').find('.e').each( async function(ThisCountElem) {  
              if(ThisCountElem+1 === TotalChunks){
                let  HTMLX=$(this).last().html();
                ProfileLink=$(this).last().find('div').children('a').attr("href");
                let  Name=$(this).last().find('div').children('a').children('strong').html();
                ProfileName=Name.trim();          
                $(this).last().find('div').children('div').each(  async function(){
                  if($(this).children('span').html()){
                    content = content + " " + $(this).children('span').html();
                  }           
                })
              }
              
            }); 
            //console.log("Friend Profile Link =======>",ProfileLink);
            //console.log("Friend Profile Name =======>",ProfileName);
            let FriendFullName = ProfileName.split(" ");
            let FirstCountx =0;
            let FriendFirstName ="";
            let FriendLastName ="";
            if(FriendFullName.length>1){
                FriendFullName.map(function(eachval){
                    if(FirstCountx ===   0){
                        FriendFirstName = eachval;
                    }else{
                        FriendLastName=FriendLastName+" "+eachval;
                    }
                    FirstCountx=FirstCountx+1;
                  });
            }else{
                FriendFirstName = FriendFullName;
            }
            //console.log("Friend First name ==",FriendFirstName.trim());
            //console.log("Friend Last name ==",FriendLastName.trim());
            //console.log("Message Thread  Contant  =======>",content);
            if(ProfileName == FaceBookUsername.trim()){
                port.postMessage({ConFlag:"UDATEIFRAMEURLONLY"});
                //console.log("TODO Call postMessage to Background to update the link in Iframe555555555555555555555 :TYPEONE");
                //TODO Call postMessage to Background to update the link in Iframe
            }else{
                IncomingMessage = content.split(',').join(" , ");
                IncomingMessage = IncomingMessage.split('.').join("  ");
                IncomingMessage = IncomingMessage.split('?').join(" ");
                IncomingMessage = IncomingMessage.split('<br>').join(" ");
                IncomingMessage = IncomingMessage.split('`').join(" ");
                IncomingMessage = IncomingMessage.split("'").join(" ");
                IncomingMessage = IncomingMessage.split('"').join(" ");
                IncomingMessage = IncomingMessage.split('*').join(" ");
                IncomingMessage = IncomingMessage.split('’').join(" ");
                IncomingMessage = IncomingMessage.split('“').join(" ");
                IncomingMessage = IncomingMessage.split('”').join(" ");
                IncomingMessage = " "+IncomingMessage+" ";
                IncomingMessage=IncomingMessage.toLowerCase();
                    if(AutoResponderKeyword){
                        let keyObj = JSON.parse(AutoResponderKeyword);
                        //console.log("I Got This Incoming Message ))))))",IncomingMessage);
                        //console.log("I Got This Keywords ))))))",keyObj);
                        //console.log("I Got This Keywords Count ))))))",keyObj.length);
                        let totalkeyObj =keyObj.length;
                        if(totalkeyObj == 0){
                            if(DefaultMessageState  ==  "1" ){
                                let setDefaultMessageCheckDataOne  =   {
                                    ResponseTime:Nowtime,
                                    FriendProfileLink:ProfileLink,
                                    FriendFirstName:FriendFirstName,
                                    FriendLastName:FriendLastName,
                                    FacebooKFriendId:FacebooKFriendId,
                                    FacebookUserId:FacebookUserId

                                }
                                //console.log("TODO Call postMessage to Background to Check Default Message Post For the User :TYPETWO1",setDefaultMessageCheckDataOne);
                                port.postMessage({ConFlag:"CHECKELIGABLEFORDEFAULTMESSAGE",payload:setDefaultMessageCheckDataOne});
                                //TODO Call postMessage to Background to Check Default Message Post For the User
                            }else{
                                port.postMessage({ConFlag:"UDATEIFRAMEURLONLY"});
                                //console.log("TODO Call postMessage to Background to update the link in Iframe1TTTTTTTTTTTTTTTTTTTTt :TYPEONE");
                                //TODO Call postMessage to Background to update the link in Iframe
                            }
                        }else{
                                let ResponseText="";
                                await keyObj.map(function(eachval){
                                let keywordToFind =eachval.keyword.toLowerCase();
                                    keywordToFind = " "+keywordToFind+" ";
                                    if (IncomingMessage.indexOf(keywordToFind)!=-1)
                                    {
                                        if(ResponseText ==""){
                                        ResponseText = eachval.message
                                        }else{
                                        ResponseText = ResponseText+" "+eachval.message;
                                        }                 
                                    }
                                });
                                //console.log("I Got The Message as ))))))",ResponseText);
                                if(ResponseText == ""){
                                    if(DefaultMessageState  ==  "1" && IsFaceBookLoggedIn=="true"){
                                        let setDefaultMessageCheckDataTwo  =   {
                                            ResponseTime:Nowtime,
                                            FriendProfileLink:ProfileLink,
                                            FriendFirstName:FriendFirstName,
                                            FriendLastName:FriendLastName,
                                            FacebooKFriendId:FacebooKFriendId,
                                            FacebookUserId:FacebookUserId

                                        }
                                        //console.log("TODO Call postMessage to Background to Check Default Message Post For the User :TYPETWO2",setDefaultMessageCheckDataTwo);
                                        port.postMessage({ConFlag:"CHECKELIGABLEFORDEFAULTMESSAGE",payload:setDefaultMessageCheckDataTwo});
                                        //TODO Call postMessage to Background to Check Default Message Post For the User
                                    }else{
                                        port.postMessage({ConFlag:"UDATEIFRAMEURLONLY"});
                                        console.log("TODO Call postMessage to Background to update the link in Iframe222222222222222222 :TYPEONE");
                                        //TODO Call postMessage to Background to update the link in Iframe
                                    }
                                }else{
                                    if(IsFaceBookLoggedIn=="true" && AutoresponderStatus == "1"){
                                        //console.log("TODO Send Message then Call postMessage to Background to Store User Data and update the link in Iframe :TYPETHREE");
                                        //TODO Send Message then Call postMessage to Background to Store User Data and update the link in Iframe
                                        //TODO SAVE MESAGE IN FB
                                        let FriendFirstNameAdd = " "+FriendFirstName+" ";
                                        let FriendLastNameAdd = " "+FriendLastName+" ";

                                        let NewResponseText = ResponseText.split('{first_name}').join(FriendFirstNameAdd);
                                        NewResponseText = NewResponseText.split('{last_name}').join(FriendLastNameAdd);

                                        $('#composerInput').val(NewResponseText);
                                        $( "#composer_form" ).submit();
                                        let setDefaultMessageSaveONEX={
                                        FacebookFirstName: FriendFirstName,
                                        FacebookLastName: FriendLastName,
                                        FacebookUserId: FacebookUserId,
                                        FriendFacebookId: FacebooKFriendId,
                                        MfenevanId: MfenevanId,
                                        ProfileLink:ProfileLink,
                                        ResponseMessage: NewResponseText,
                                        ResponseTime:Nowtime,
                                        MessageSenderType:"last_contact_outgoing"
                                        };
                                        port.postMessage({ConFlag:"STORESENDDETAILS",payload:setDefaultMessageSaveONEX});
                                    }else if(IsFaceBookLoggedIn=="true" && AutoresponderStatus == "0" && DefaultMessageState  ==  "1"){
                                        let setDefaultMessageCheckDataThree  =   {
                                            ResponseTime:Nowtime,
                                            FriendProfileLink:ProfileLink,
                                            FriendFirstName:FriendFirstName,
                                            FriendLastName:FriendLastName,
                                            FacebooKFriendId:FacebooKFriendId,
                                            FacebookUserId:FacebookUserId

                                        }
                                        //console.log("TODO Call postMessage to Background to Check Default Message Post For the User :TYPETWO3",setDefaultMessageCheckDataThree);
                                        port.postMessage({ConFlag:"CHECKELIGABLEFORDEFAULTMESSAGE",payload:setDefaultMessageCheckDataThree});
                                        //TODO Call postMessage to Background to Check Default Message Post For the User
                                    } else{
                                        port.postMessage({ConFlag:"UDATEIFRAMEURLONLY"});
                                        //console.log("TODO Call postMessage to Background to update the link in Iframe333333333333333333333333 :TYPEONE");
                                        //TODO Call postMessage to Background to update the link in Iframe
                                    }
                                }
                        }
                    }else{
                        if(DefaultMessageState  ==  "1" ){
                            let setDefaultMessageCheckDataOne  =   {
                                ResponseTime:Nowtime,
                                FriendProfileLink:ProfileLink,
                                FriendFirstName:FriendFirstName,
                                FriendLastName:FriendLastName,
                                FacebooKFriendId:FacebooKFriendId,
                                FacebookUserId:FacebookUserId

                            }
                            //console.log("TODO Call postMessage to Background to Check Default Message Post For the User :TYPETWO1",setDefaultMessageCheckDataOne);
                            port.postMessage({ConFlag:"CHECKELIGABLEFORDEFAULTMESSAGE",payload:setDefaultMessageCheckDataOne});
                            //TODO Call postMessage to Background to Check Default Message Post For the User
                        }else{
                            port.postMessage({ConFlag:"UDATEIFRAMEURLONLY"});
                            //console.log("TODO Call postMessage to Background to update the link in Iframe1TTTTTTTTTTTTTTTTTTTTt :TYPEONE");
                            //TODO Call postMessage to Background to update the link in Iframe
                        }     
                    }
                }     
        }else{
            port.postMessage({ConFlag:"UDATEIFRAMEURLONLY"});
            //console.log("TODO Call postMessage to Background to update the link in Iframe4444444444444444444 :TYPEONE");
           //TODO Call postMessage to Background to update the link in Iframe
        }
    }
    if(msg.ConFlagBack == "INDVALBACKDEFAULT"){
        //console.log("I Have TO Response With This XXXXXXXXXXXXXXXXXXXX>>>>>>>>>>>>>>>>",msg.userInfoDetails);
        //TODO Call postMessage to Background to update the link in Iframe
        //TODO SAVE MESAGE IN FB
        let FriendFirstName= msg.userInfoDetails.FacebookFirstName;
        let FriendLastName= msg.userInfoDetails.FacebookLastName;
        let newResMessage   =msg.userInfoDetails.ResponseMessage;
        let FriendFirstNameAdd = " "+FriendFirstName+" ";
        let FriendLastNameAdd = " "+FriendLastName+" ";

        let NewResponseText = newResMessage.split('{first_name}').join(FriendFirstNameAdd);
        NewResponseText = NewResponseText.split('{last_name}').join(FriendLastNameAdd);
        $('#composerInput').val(NewResponseText);
        $( "#composer_form" ).submit();
        let Nowtime=$.now();
        let setDefaultMessageSaveONEX={
        FacebookFirstName: msg.userInfoDetails.FacebookFirstName,
        FacebookLastName: msg.userInfoDetails.FacebookLastName,
        FacebookUserId: msg.userInfoDetails.FacebookUserId,
        FriendFacebookId: msg.userInfoDetails.FriendFacebookId,
        MfenevanId: msg.userInfoDetails.MfenevanId,
        ProfileLink: msg.userInfoDetails.ProfileLink,
        ResponseMessage: NewResponseText,
        ResponseTime:Nowtime,
        MessageSenderType:"last_default_message_time"
        };
        port.postMessage({ConFlag:"STORESENDDETAILS",payload:setDefaultMessageSaveONEX});
        //console.log("TODO Send Message then Call postMessage to Background to Store User Data and update the link in Iframe :TYPETHREE");
    }
});
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {

/**
* This section will check the Profile Info and Wethere User Is logged into Facebook Or Not
*/
if(request.catch === "read-chat-thread-contents"){

}
});