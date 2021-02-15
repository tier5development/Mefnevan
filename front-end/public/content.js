chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  
  
  /**
    * This section will check the Profile Info and Wethere User Is logged into Facebook Or Not
  */
  if(request.catch === "get-login-info"){
  console.log('I am getting this', request);  
  let WindowId    =   request.data.windowinfo;
  let TabId   =   request.data.tabinfo;
  let WindowIdString  =   String(WindowId);
  let TabIdString =   String(TabId);
  let jwtToken =request.data.userToken;
  let tokens = jwtToken.split(".");
  let tokenstring = atob(tokens[1]);
  let myObj = JSON.parse(tokenstring);
  let UserKyubiToken = myObj.user.id;
        
        let UserFacebookid = "";
        let UserFacebookUsername  = "";
        let UserFacebookName  = "";
        let UserFacebookImage = "";
        let UserLoggedInFacebook  = false;
        // console.log("UserKyubiToken =====>",UserKyubiToken);
        // console.log("WindowId =====>",WindowId);
        // console.log("TabId =====>",TabId);
        if($('#mbasic_inline_feed_composer').length){
          console.log("User IS Logged In");
          let UserURL= $(".ca").find("a").attr("href");
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
          UserLoggedInFacebook  = false;
          console.log("User IS NOT Logged In");
          UserKyubiToken=atob(tokens[1]);
          UserFacebookid="";
          UserFacebookUsername="";
          UserFacebookName="";
          UserFacebookImage="";
          UserLoggedInFacebook=false;
          
        }
        let parameters={
          token : UserKyubiToken,
          fb_id : UserFacebookid,
          fb_username : UserFacebookUsername,
          fb_name : UserFacebookName,
          fb_image  : UserFacebookImage,
          fb_logged_id  : UserLoggedInFacebook,
          tabinfo : TabId,
          windowinfo  : WindowId
        }
       // chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});
  }
  /**
    * This section will check the Message List With WindowId
  */ 
  else if(request.catch === "check-new-incoming-messag"){
    let WindowId    =   request.data.windowinfo;
    let TabId   =   request.data.tabinfo;
    let WindowIdString  =   String(WindowId);
    let TabIdString =   String(TabId);
  
    let jwtToken =request.data.userToken;
    let tokens = jwtToken.split(".");
    let tokenstring = atob(tokens[1]);
    let myObj = JSON.parse(tokenstring);
    let UserKyubiToken = myObj.user.id;    
      var IndividualMessageList = [];
      if($('#objects_container #root').find('div').find('section').find('table').length  > 0){
        $('#objects_container #root').find('div').find('section').find('table').each( async function() {
          if($(this).find('tbody').find('tr').find('td').find('header').length  !=  0){
            let senderUrl=$(this).find('tbody').find('tr').find('td').find('header').find('h3').find('a').attr("href"); 
            let MnO={"indvidualURL":senderUrl}
            IndividualMessageList.push(MnO);
          }
        });
        console.log("Check",IndividualMessageList);
        let parameters={          
          individualThreadList  : IndividualMessageList,
          tabinfo : TabId,
          windowinfo  : WindowId
        }
        console.log("Window Links are",IndividualMessageList);
        chrome.runtime.sendMessage({type: "StoreMessageLinkInStorage", options: parameters});
        //chrome.runtime.sendMessage({type: "OpenIndividualMessageThenCloseAndReopenMessageList", options: parameters});
      }else{
        console.log("Close and reopen the Message window")
      }
    }
  /**
    * This section will check the Message Contents With WindowId
  */
  else if(request.catch === "read-message-details"){
    let WindowId    =   request.data.windowinfo;
    let TabId   =   request.data.tabinfo;
    let WindowIdString  =   String(WindowId);
    let TabIdString =   String(TabId);
  
    let jwtToken =request.data.userToken;
    let tokens = jwtToken.split(".");
    let tokenstring = atob(tokens[1]);
    let myObj = JSON.parse(tokenstring);
    let UserKyubiToken = myObj.user.id;
    let AutoResponderKeyword=request.data.AutoResponderKeyword;
    let AutoresponderStatus=request.data.AutoresponderStatus;
    let DefaultMessageState=request.data.DefaultMessageState;
    let DefaultMessageTexting=request.data.DefaultMessageTexting;
    let DefaultMessageTimeDelay=request.data.DefaultMessageTimeDelay;
    let FaceBookUsername=request.data.FaceBookUsername;
    let FacebookUserId=request.data.FacebookUserId;
    let IsFaceBookLoggedIn=request.data.IsFaceBookLoggedIn;
    let MfenevanId=request.data.MfenevanId;
    let WindowURL=request.data.WindowURL;
    let userToken=request.data.userToken;
    let newWindowURL=WindowURL.replace('https://mbasic.facebook.com/messages/read/?tid=cid.c.', '');
    let reslinksplit = newWindowURL.split("&");
    let FacebookIdString  = reslinksplit[0].split("%3A");
    let FriendFacebookId  = "";
    if(FacebookUserId  ==  FacebookIdString[0]){
      FriendFacebookId =FacebookIdString[1];
    }else{
      FriendFacebookId =FacebookIdString[0];
    }
    let  ProfileLink  = "";
    let ProfileName = "";
    let content =  "";
    console.log("I am Reciving this =======>",request.data);
    
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
    }else{
      console.log("Please close the  Message Window With WindowId");
      let params ={
        tabinfo : TabId,
        windowinfo  : WindowId
      }
      chrome.runtime.sendMessage({type: "CloseTheIndividualMessageThread", options: params});
    }
    console.log("My Facebook ID =======>",FacebookUserId);
    console.log("Friend Facebook ID =======>",FriendFacebookId);
    console.log("Friend Profile Link =======>",ProfileLink);
    console.log("Friend Profile Name =======>",ProfileName);
    console.log("Message Thread  Contant  =======>",content);
    if(ProfileName == FaceBookUsername.trim()){
      console.log("Please close the  Message Window With WindowId");
      let params ={
        tabinfo : TabId,
        windowinfo  : WindowId
      }
      chrome.runtime.sendMessage({type: "CloseTheIndividualMessageThread", options: params});
    }else{
        IncomingMessage = content.split(',').join(" , ");
        IncomingMessage = IncomingMessage.split('.').join(" . ");
        IncomingMessage = IncomingMessage.split('?').join("? ");
        IncomingMessage = IncomingMessage.split('<br>').join(" ");
        IncomingMessage = " "+IncomingMessage+" ";
        IncomingMessage=IncomingMessage.toLowerCase();
        let keyObj = JSON.parse(AutoResponderKeyword);
        let totalkeyObj =keyObj.length;
        console.log("Please Find Keywords Inthe Contents !!!!!!!!!!!!!");
        if(totalkeyObj == 0){
          let params ={
            tabinfo : TabId,
            windowinfo  : WindowId
          }
          chrome.runtime.sendMessage({type: "CloseTheIndividualMessageThread", options: params});
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
          let Nowtime=$.now();
          if(ResponseText  == ""){
            if(DefaultMessageState  ==  "1" && AutoresponderStatus  ==  "1"){
              
              let params ={
                tabinfo : TabId,
                windowinfo  : WindowId,
                FriendFacebookId  : FriendFacebookId,
                ProfileLink : ProfileLink,
                ProfileName : ProfileName,
                TimeNow : Nowtime
              }
              chrome.runtime.sendMessage({type: "CheckWetherUserEligibleForDefaultMessage", options: params});
            }else{
              let params ={
                tabinfo : TabId,
                windowinfo  : WindowId
              }
              chrome.runtime.sendMessage({type: "CloseTheIndividualMessageThread", options: params});
            }
            
            console.log("Please Reply With Default !!!!!!!!!!!!!");

          }else{
            $('#composerInput').val(ResponseText);
            $( "#composer_form" ).submit();
            let params ={
              tabinfo : TabId,
              windowinfo  : WindowId,
              FacebookUserId: FacebookUserId,
              FriendFacebookId: FriendFacebookId,
              MfenevanId: MfenevanId,
              ProfileLink: ProfileLink,
              ProfileName: ProfileName,
              DefaultMessageLastTime: 0,
              LastContactOutGoing:Nowtime,
            }
            console.log("Send It To Background to Save And Close",params);
            console.log("Please Reply With This !!!!!!!!!!!!!",ResponseText);
            chrome.runtime.sendMessage({type: "CloseAndSaveTheLastMessageOut", options: params});
          }
          
        }
      

    }

  }
  else if(request.catch === "read-chat-thread-contents"){
    let WindowId    =   request.data.windowinfo;
    let TabId   =   request.data.tabinfo;
    let WindowIdString  =   String(WindowId);
    let TabIdString =   String(TabId);
    let jwtToken =request.data.userToken;
    let tokens = jwtToken.split(".");
    let tokenstring = atob(tokens[1]);
    let myObj = JSON.parse(tokenstring);
    let UserKyubiToken = myObj.user.id;
    let AutoResponderKeyword=request.data.AutoResponderKeyword;
    let AutoresponderStatus=request.data.AutoresponderStatus;
    let DefaultMessageState=request.data.DefaultMessageState;
    let DefaultMessageTexting=request.data.DefaultMessageTexting;
    let DefaultMessageTimeDelay=request.data.DefaultMessageTimeDelay;
    let FaceBookUsername=request.data.FaceBookUsername;
    let FacebookUserId=request.data.FacebookUserId;
    let IsFaceBookLoggedIn=request.data.IsFaceBookLoggedIn;
    let MfenevanId=request.data.MfenevanId;
    let WindowURL=request.data.WindowURL;
    let userToken=request.data.userToken;
    let newWindowURL=WindowURL.replace('https://mbasic.facebook.com/messages/read/?tid=cid.c.', '');
    let reslinksplit = newWindowURL.split("&");
    let FacebookIdString  = reslinksplit[0].split("%3A");
    let FriendFacebookId  = "";
    if(FacebookUserId  ==  FacebookIdString[0]){
      FriendFacebookId =FacebookIdString[1];
    }else{
      FriendFacebookId =FacebookIdString[0];
    }
    let  ProfileLink  = "";
    let ProfileName = "";
    let content =  "";
    let IncomingMessage = "";
    let Nowtime=$.now();
    console.log("This I Recived",request.data);
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

      if(ProfileName == FaceBookUsername.trim()){
        content = "";
      }else{
        IncomingMessage = content.split(',').join(" , ");
        IncomingMessage = IncomingMessage.split('.').join(" . ");
        IncomingMessage = IncomingMessage.split('?').join(" ? ");
        IncomingMessage = IncomingMessage.split('!').join(" ! ");
        IncomingMessage = IncomingMessage.split(',').join(" , ");
        IncomingMessage = IncomingMessage.split('#').join(" # ");
        IncomingMessage = IncomingMessage.split('*').join(" * ");
        IncomingMessage = IncomingMessage.split('<br>').join(" ");
        IncomingMessage = " "+IncomingMessage+" ";
        IncomingMessage=IncomingMessage.toLowerCase();
      }
        // IncomingMessage = content.split(',').join(" , ");
        // IncomingMessage = IncomingMessage.split('.').join(" . ");
        // IncomingMessage = IncomingMessage.split('?').join("? ");
        // IncomingMessage = IncomingMessage.split('<br>').join(" ");
        // IncomingMessage = " "+IncomingMessage+" ";
        // IncomingMessage=IncomingMessage.toLowerCase();
    }else{
      console.log("Close The Window Only4");
      let params ={
        tabinfo : TabId,
        windowinfo  : WindowId
      }
      chrome.runtime.sendMessage({type: "CloseAndReOpenNewWindow", options: params});
    }
          let keyObj = JSON.parse(AutoResponderKeyword);
          let totalkeyObj =keyObj.length;
          let ResponseText="";
          let ResponseArrayNonUniform = []
    if(DefaultMessageState  == "1" && AutoresponderStatus ==  "1" && content !=""){          
          if(totalkeyObj == 0){
            console.log("Send it To Default Message Check 1");
            let params ={
              tabinfo : TabId,
              windowinfo  : WindowId,
              FriendFacebookId  : FriendFacebookId,
              ProfileLink : ProfileLink,
              ProfileName : ProfileName,
              TimeNow : Nowtime
            }
            chrome.runtime.sendMessage({type: "CheckWetherUserEligibleForDefaultMessage", options: params});
          }else{
            await keyObj.map(function(eachval){
              let keywordToFind =eachval.keyword.toLowerCase();
                  keywordToFind = " "+keywordToFind+" ";
                  if (IncomingMessage.indexOf(keywordToFind)!=-1)
                  {
                    ResponseArrayNonUniform[IncomingMessage.indexOf(keywordToFind)]=eachval.message;
                    if(ResponseText ==""){
                      ResponseText = eachval.message
                    }else{
                      ResponseText = ResponseText+" "+eachval.message;
                    }                 
                  }
            });
            if(ResponseText  == ""){
              console.log("Send it To Default Message Check 2");
              let params ={
                tabinfo : TabId,
                windowinfo  : WindowId,
                FriendFacebookId  : FriendFacebookId,
                ProfileLink : ProfileLink,
                ProfileName : ProfileName,
                TimeNow : Nowtime
              }
              chrome.runtime.sendMessage({type: "CheckWetherUserEligibleForDefaultMessage", options: params});
            }else{
              
              let NewResponseMessage="";
              ResponseArrayNonUniform.map(function(eachItem){
                NewResponseMessage=NewResponseMessage+""+eachItem+ String.fromCharCode(13);
              })
              
              $('#composerInput').val(NewResponseMessage);
              $( "#composer_form" ).submit();
              let params ={
                tabinfo : TabId,
                windowinfo  : WindowId,
                FacebookUserId: FacebookUserId,
                FriendFacebookId: FriendFacebookId,
                MfenevanId: MfenevanId,
                ProfileLink: ProfileLink,
                ProfileName: ProfileName,
                DefaultMessageLastTime: 0,
                LastContactOutGoing:Nowtime,
              }
              console.log("Send Response Message and send  it To Save in DB and Close 1");
              chrome.runtime.sendMessage({type: "CloseAndSaveTheLastMessageOutAndOpenNew", options: params});
            }
          }
    }else if(DefaultMessageState  == "0" && AutoresponderStatus ==  "1" && content !=""){
      if(totalkeyObj == 0){
        console.log("Close The Window Only1");
        let params ={
          tabinfo : TabId,
          windowinfo  : WindowId
        }
        chrome.runtime.sendMessage({type: "CloseAndReOpenNewWindow", options: params});
      }else{
        await keyObj.map(function(eachval){
          let keywordToFind =eachval.keyword.toLowerCase();
              keywordToFind = " "+keywordToFind+" ";
              if (IncomingMessage.indexOf(keywordToFind)!=-1)
              {
                ResponseArrayNonUniform[IncomingMessage.indexOf(keywordToFind)]=eachval.message;
                if(ResponseText ==""){
                  ResponseText = eachval.message
                }else{
                  ResponseText = ResponseText+" "+eachval.message;
                }                 
              }
        });
        if(ResponseText  == ""){
          console.log("Close The Window Only2");
          let params ={
            tabinfo : TabId,
            windowinfo  : WindowId
          }
          chrome.runtime.sendMessage({type: "CloseAndReOpenNewWindow", options: params});
        }else{
          let NewResponseMessage="";
              ResponseArrayNonUniform.map(function(eachItem){
                NewResponseMessage=NewResponseMessage+""+eachItem+ String.fromCharCode(13);
              })
              
              $('#composerInput').val(NewResponseMessage);
              $( "#composer_form" ).submit();
          let params ={
            tabinfo : TabId,
            windowinfo  : WindowId,
            FacebookUserId: FacebookUserId,
            FriendFacebookId: FriendFacebookId,
            MfenevanId: MfenevanId,
            ProfileLink: ProfileLink,
            ProfileName: ProfileName,
            DefaultMessageLastTime: 0,
            LastContactOutGoing:Nowtime,
          }
          chrome.runtime.sendMessage({type: "CloseAndSaveTheLastMessageOutAndOpenNew", options: params});
          console.log("Send Response Message and send  it To Save in DB and Close 2");
        }
      }
    }else if(DefaultMessageState  == "1" && AutoresponderStatus ==  "0" && content !=""){
      console.log("Send it To Default Message Check 3");
      let params ={
        tabinfo : TabId,
        windowinfo  : WindowId,
        FriendFacebookId  : FriendFacebookId,
        ProfileLink : ProfileLink,
        ProfileName : ProfileName,
        TimeNow : Nowtime
      }
      chrome.runtime.sendMessage({type: "CheckWetherUserEligibleForDefaultMessage", options: params});
    }else{
      console.log("Close The Window Only3");
      let params ={
        tabinfo : TabId,
        windowinfo  : WindowId
      }
      chrome.runtime.sendMessage({type: "CloseAndReOpenNewWindow", options: params});
    }
  }
  else if(request.catch === "send-default-message-Facebook-User"){
    console.log("Hello this default",request.paramdata);
    if(request.paramdata.AutoresponderStatus =="1" && request.paramdata.DefaultMessageStatus =="1"){
      $('#composerInput').val(request.paramdata.DefaultMessageTexting);
      $( "#composer_form" ).submit();
      let Nowtime=$.now();
      let params ={
        tabinfo : request.paramdata.tabinfo,
        windowinfo  : request.paramdata.windowinfo,
        FacebookUserId: request.paramdata.FacebookUserId,
        FriendFacebookId: request.paramdata.FriendFacebookId,
        MfenevanId: request.paramdata.MfenevanId,
        ProfileLink: request.paramdata.ProfileLink,
        ProfileName: request.paramdata.ProfileName,
        DefaultMessageLastTime: Nowtime,
        LastContactOutGoing:Nowtime,
      }
      console.log("Send It To Background to Save And Close",params);
      chrome.runtime.sendMessage({type: "CloseAndSaveTheLastMessageOutAndOpenNew", options: params});
    }
    
  }
});