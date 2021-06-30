const getApiUrl = process.kyubi.appBaseBackendUrl;
const MessageListUrl = `https://mbasic.facebook.com/messages`;
const mBasicUrl = 'https://mbasic.facebook.com';
const mFacebook = 'https://m.facebook.com';
const method = { POST: "post", GET: "get", PUT: "put", DELETE: "delete" };
const toJsonStr = (val) => JSON.stringify(val);
/** 
 * @handleRequest
 * this function will handel the https request
 * 
*/
const handleRequest = (path, methodType, bodyData) => {
    let getWithCredentialHeader = {
        'Accept': 'application/json', 'Content-Type': 'application/json','Access-Control-Allow-Origin': true
    };
    return fetch(getApiUrl + path, {
      method: methodType,
      headers: getWithCredentialHeader,
      body: bodyData,
    });
};
/** 
 * This Section will Listen to the message send form the Tab Pages
 * 
*/
chrome.runtime.onMessage.addListener(async function(request, sender) {
  if (request.type == "storeUserInfoOrQueryThenStore"){
      let  params = {
        user_rec    :   localStorage.getItem('kyubi_user_token'),
        fb_id   :   request.options.FacebookId,
        fb_username :   request.options.FacebookUsername,
        fb_name :   request.options.FacebookName,
        fb_image    :  request.options.FacebookImage,
        fb_logged_id    :   request.options.LoggedInFacebook
      };
      if(request.options.LoggedInFacebook === true){
        localStorage.setItem('fb_id', request.options.FacebookId);
        localStorage.setItem('fb_username', request.options.FacebookUsername);
        localStorage.setItem('fb_name', request.options.FacebookName);
        localStorage.setItem('fb_image', request.options.FacebookImage);
        localStorage.setItem('fb_logged_id', request.options.LoggedInFacebook);
        localStorage.setItem('inBackgroundFetching', false);
      }
      await handleRequest(
        "/api/user/userCheckStoreNRetrive",
        method.POST,
        toJsonStr(params)
      ).then(async response =>  {
          let responsenewvalue = await response.json();
          let  urlArray="[]";
          console.log("This from DB",responsenewvalue);
          localStorage.setItem('CheckMessageNReply', 0);
          localStorage.setItem('ListURLArray', urlArray);
          localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
          localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
          localStorage.setItem('fb_id', responsenewvalue.payload.UserInfo.facebook_fbid);
          localStorage.setItem('fb_username', responsenewvalue.payload.UserInfo.facebook_name);
          localStorage.setItem('fb_name', responsenewvalue.payload.UserInfo.facebook_profile_name);
          localStorage.setItem('fb_image', responsenewvalue.payload.UserInfo.facebook_image);
          localStorage.setItem('fb_logged_id', request.options.LoggedInFacebook);
          localStorage.setItem('inBackgroundFetching', false);
          let AutoResponderStatus = 0; 
          let DefaultMessageStatus =0;
          let UserLoggedInFacebook=request.options.LoggedInFacebook;
          let BackGroundFetchingStatus  =false;
          if(responsenewvalue.payload.UserSettings.default_message){
            localStorage.setItem('default_message', responsenewvalue.payload.UserSettings.default_message);
            DefaultMessageStatus=responsenewvalue.payload.UserSettings.default_message;
          }else{
            localStorage.setItem('default_message', 0);
          }
          if(responsenewvalue.payload.UserSettings.default_message_text){
            localStorage.setItem('default_message_text', responsenewvalue.payload.UserSettings.default_message_text);
          }else{
            localStorage.setItem('default_message_text',"");
          }
          if(responsenewvalue.payload.UserSettings.autoresponder){
            localStorage.setItem('autoresponder', responsenewvalue.payload.UserSettings.autoresponder);
            AutoResponderStatus=responsenewvalue.payload.UserSettings.autoresponder;
          }else{
            localStorage.setItem('autoresponder', 0);
          }
          if(responsenewvalue.payload.UserSettings.default_time_delay){
            localStorage.setItem('default_time_delay', responsenewvalue.payload.UserSettings.default_time_delay);
          }
          localStorage.setItem('keywordsTally', JSON.stringify(responsenewvalue.payload.AutoResponderKeywords));
          if(localStorage.getItem('fbprofile')){
            let newtab=parseInt(localStorage.getItem('fbprofile'));
            chrome.tabs.remove(newtab, function() { 
            });
            localStorage.removeItem('fbprofile');
          }
          if((AutoResponderStatus == 1 || DefaultMessageStatus == 1) && UserLoggedInFacebook== true && BackGroundFetchingStatus==  false ){
            if(localStorage.getItem('fbmunread')){
              let fbmunreadTab=parseInt(localStorage.getItem('fbmunread'));
              chrome.tabs.remove(fbmunreadTab, function() { 
              });
              localStorage.removeItem('fbmunread');
              const myNewUrl  =   `https://m.facebook.com/messages/`;
              let CreateTab    =   chrome.tabs.create({
                    url: myNewUrl,
                    active: false,
                    pinned:true
              },function(tabx) { 
                    let fbmunread=tabx.id;
                    localStorage.setItem('fbmunread', fbmunread);
                    
              });
            }else{
              const myNewUrl  =   `https://m.facebook.com/messages/`;
              let CreateTab    =   chrome.tabs.create({
                    url: myNewUrl,
                    active: false,
                    pinned:true
              },function(tabx) { 
                    let fbmunread=tabx.id;
                    localStorage.setItem('fbmunread', fbmunread);
                    
              });
            }
          }
      }).catch(error=>{
        console.log("We are really Sorry we found error in fetching the Profile Info",error);
      })
  }else if(request.type == "OverlayTriggerIndividual"){
    let fbprofileID=parseInt(localStorage.getItem('fbprofile'));
    let senderTabId=parseInt(sender.tab.id);
    if(fbprofileID === senderTabId){
      chrome.tabs.sendMessage(senderTabId,{type: "OverlayCreateProfile", options: "FromBackGround"}); 
    }
  }else if(request.type == "OverlayTrigger"){
    let newtabx=parseInt(localStorage.getItem('fbmunread'));
    let senderTabId=parseInt(sender.tab.id);
    if(newtabx === senderTabId){
      chrome.tabs.sendMessage(newtabx,{type: "OverlayCreateList", options: "FromBackGround"}); 
    }
  }else if(request.type == "OverlayTriggerThread"){
    let fbthreadID=parseInt(localStorage.getItem('fbthread'));
    let senderTabId=parseInt(sender.tab.id);
    if(fbthreadID === senderTabId){
      chrome.tabs.sendMessage(senderTabId,{type: "OverlayCreateIndividual", options: "FromBackGround"}); 
    }
  }
})

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(async function(msg) {
    if(msg.ConFlag == "StoreMessageLinkInLocalStorage"){
      //console.log("Store In Array",msg);
      let ListURL=localStorage.getItem('ListURLArray');
      let ListURLArray=JSON.parse(ListURL);
      if(ListURLArray.length  === 0){
        ListURLArray[ListURLArray.length]=mBasicUrl+""+msg.options;
        let NewListURLArray=JSON.stringify(ListURLArray);
        localStorage.setItem('ListURLArray', NewListURLArray);
      }else{
        let check = ListURLArray.includes(mBasicUrl+""+msg.options);
        if(check){

        }else{
          ListURLArray[ListURLArray.length]=mBasicUrl+""+msg.options;
          let NewListURLArray=JSON.stringify(ListURLArray);
          localStorage.setItem('ListURLArray', NewListURLArray);
        }
      }
      CheckLocalStoreAndHitIndividualMList();
    }
    if(msg.ConFlag == "CheckMessageContent"){
      //console.log("Now  Again I am In BackGround xxxxxxxxxxxxxxxxxxxx",msg.MessageDetails);
      let fb_Name=localStorage.getItem('fb_username');
      let FacebookUserId=localStorage.getItem('fb_id');
      fb_Name=fb_Name.trim();
      let m_username=msg.MessageDetails.profile_name.trim();
      let ProfileLink=msg.MessageDetails.ProfileLink.trim();
      if(msg.MessageDetails.facebook_Id[0].trim() == FacebookUserId.trim()){
        FacebooKFriendId=msg.MessageDetails.facebook_Id[1].trim()
      }else{
        FacebooKFriendId=msg.MessageDetails.facebook_Id[0].trim()
      }
      if(fb_Name!=m_username){
        let fb_logged_id=localStorage.getItem('fb_logged_id');
        let inBackgroundFetching=localStorage.getItem('inBackgroundFetching');
        let default_message=localStorage.getItem('default_message');
        let autoresponder=localStorage.getItem('autoresponder');
        if(fb_logged_id == "true" && inBackgroundFetching== "false"){
          if(default_message !=0  ||  autoresponder!=0){
                //console.log("I am Hear 156");
                let IncomingMessage = msg.MessageDetails.message_content.split(',').join(" , ");
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
                IncomingMessage = IncomingMessage.split('!').join(" ");
                IncomingMessage = IncomingMessage.split('@').join(" ");
                IncomingMessage = IncomingMessage.split('#').join(" ");
                IncomingMessage = IncomingMessage.split('%').join(" ");
                IncomingMessage = IncomingMessage.split('&').join(" ");
                IncomingMessage = IncomingMessage.split('*').join(" ");
                IncomingMessage = IncomingMessage.split('^').join(" ");
                IncomingMessage=" " + IncomingMessage.toLowerCase()+" ";
                let FriendFaceBookName=m_username;
                let UserFaceBookName=fb_Name;
                let AutoResponderKeyword=localStorage.getItem('keywordsTally');
                let MfenevanId  = localStorage.getItem('user_id');
                let keyObj = JSON.parse(AutoResponderKeyword);
                let FriendFullName = FriendFaceBookName.split(" ");
                let FirstCountx =0;
                let FriendFirstName ="";
                let FriendLastName ="";
                let NowTime=new Date().getTime(); 
                if(FriendFullName.length>1){
                  //console.log("I am Hear 187");
                    FriendFullName.map(function(eachval){
                        if(FirstCountx ===   0){
                            FriendFirstName = eachval;
                        }else{
                            FriendLastName=FriendLastName+" "+eachval;
                        }
                        FirstCountx=FirstCountx+1;
                      });
                }else{
                  //console.log("I am Hear 197");
                    FriendFirstName = FriendFullName;
                }
                let totalkeyObj =keyObj.length;
                if(totalkeyObj == 0){
                  //console.log("I am Hear 202");
                  let paramsToSend  =   {
                    MfenevanId:MfenevanId,
                    FacebookUserId:FacebookUserId,
                    FriendFacebookId:FacebooKFriendId,
                    FacebookFirstName:FriendFirstName,
                    FacebookLastName:FriendLastName,
                    ProfileLink:ProfileLink,
                    TimeNow:NowTime
                  }
                  let response  = await handleRequest(
                    "/api/friend/checkFriendReadyToReciveDefaultMessage",
                    method.POST,
                    toJsonStr(paramsToSend)
                    );
                  let responsenewvalue = await response.json();
                  //console.log("Hit For Default",paramsToSend);
                  //console.log("Hit For Default Now Get From Backend",responsenewvalue);

                  localStorage.setItem('CheckMessageNReply',0);
                  CheckLocalStoreAndHitIndividualMList();
                }else{
                  //console.log("I am Hear 221");
                  let ResponseTextArray=[];
                  let ResponseText="";
                  await keyObj.map(function(eachval){
                    let keywordToFind =eachval.keyword.toLowerCase();
                        keywordToFind = " "+keywordToFind+" ";
                        if (IncomingMessage.indexOf(keywordToFind)!=-1)
                        {
                          //console.log("KEEEEEEEEEEEEE",keywordToFind);
                              let PointIndex=IncomingMessage.indexOf(keywordToFind);
                              ResponseTextArray[PointIndex] = eachval.autoresponder_id
                              
                        }
                  });
                  //console.log("Thisissssssssssssss Messahe array",ResponseTextArray)
                  if(ResponseTextArray.length === 0){
                    let paramsToSend  =   {
                      MfenevanId:MfenevanId,
                      FacebookUserId:FacebookUserId,
                      FriendFacebookId:FacebooKFriendId,
                      FacebookFirstName:FriendFirstName,
                      FacebookLastName:FriendLastName,
                      ProfileLink:ProfileLink,
                      TimeNow:NowTime,
                      autoresponder_id:0
                    }
                    //TODO DEFAULT
                    let response  = await handleRequest(
                      "/api/friend/checkFriendReadyToReciveDefaultMessage",
                      method.POST,
                      toJsonStr(paramsToSend)
                      );
                    let responsenewvalue = await response.json();
                    if(responsenewvalue.code == 1){
                      //console.log("Hey I am Sending This-----------------------",paramsToSend);
                      port.postMessage({userInfoDetails: responsenewvalue.payload.message,ThreadParams:paramsToSend,ConFlagBack:"DEFAULTMESSAGEBACK" });
                    }else{
                    
                      localStorage.setItem('CheckMessageNReply',0);
                      CheckLocalStoreAndHitIndividualMList();
                    }
                  }else{
                    //console.log("ThisissssssssssssssYYYYYYYYYYYYYYY Messahe array",ResponseTextArray);
                    let myArray = ResponseTextArray;
                    let unique = myArray.filter((v, i, a) => a.indexOf(v) === i);
                    let a = new Date(NowTime);
                    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    let year = a.getFullYear();
                    let month = months[a.getMonth()];
                    let date = a.getDate();
                    let hour = a.getHours();
                    let min = a.getMinutes();
                    let sec = a.getSeconds();
                    let OnlyDate = date + ' ' + month + ' ' + year ;
                    //console.log("ThisissssssssssssssXXXXXXXXXXXXXXX Messahe array",unique); 
                    let ResponseText ="";
                    let RespoArray=[];
                    // let count=0;
                    // let toc=unique.length;
                    for (let count = 0; count < unique.length; count++) {
                      let Message_payload={
                        MfenevanId:MfenevanId,
                        autoresponder_id:unique[count],
                        FriendFirstName:FriendFirstName,
                        FriendLastName:FriendLastName,
                        FacebookUserId:FacebookUserId,
                        FriendFacebookId:FacebooKFriendId,
                        ProfileLink:ProfileLink,
                        OnlyDate:OnlyDate,
                        TimeNow:NowTime
                      }
                      let response  = await handleRequest(
                        "/api/friend/checkAutoresponderMessageForGroup",
                        method.POST,
                        toJsonStr(Message_payload)
                        );
                        let responsenewvalue = await response.json();
                        if(responsenewvalue.code == 1){
                          RespoArray[count]=responsenewvalue.payload.message;
                          ResponseText = ResponseText + " " + responsenewvalue.payload.message;
                        }
                        if(count==unique.length-1){
                          console.log("MeSSSSSSSS Array ",RespoArray);
                          console.log("ARID ",unique);
                          
                          let paramsToSend  =   {
                            MfenevanId:MfenevanId,
                            FacebookUserId:FacebookUserId,
                            FriendFacebookId:FacebooKFriendId,
                            FacebookFirstName:FriendFirstName,
                            FacebookLastName:FriendLastName,
                            ProfileLink:ProfileLink,
                            TimeNow:NowTime,
                            ResponseMessage:ResponseText,
                            autoresponder_id:unique
                          }
                          console.log("-------------------------",paramsToSend)
                          if(ResponseText==""){
                            localStorage.setItem('CheckMessageNReply',0);
                            CheckLocalStoreAndHitIndividualMList();
                          }else{
                            port.postMessage({userInfoDetails: ResponseText,ThreadParams:paramsToSend,ConFlagBack:"AUTOMESSAGEBACK" });
                          }
                          
                        }
                    }
                  }
                }
          }else{
            localStorage.setItem('CheckMessageNReply',0);
            CheckLocalStoreAndHitIndividualMList();
          }
        }else{
          localStorage.setItem('CheckMessageNReply',0);
          CheckLocalStoreAndHitIndividualMList();
        }
      }else{
        localStorage.setItem('CheckMessageNReply',0);
        CheckLocalStoreAndHitIndividualMList();
      }
    }
    if(msg.ConFlag == "STOREANDCLOSE"){
      let params  =   {
        FacebookFirstName : msg.MessageDetails.FacebookFirstName,
        FacebookLastName  :msg.MessageDetails.FacebookLastName,
        FacebookUserId  :msg.MessageDetails.FacebookUserId,
        FriendFacebookId  :msg.MessageDetails.FriendFacebookId,
        MessageSenderType :msg.MessageDetails.MessageSenderType,
        MfenevanId  :msg.MessageDetails.MfenevanId,
        ProfileLink :msg.MessageDetails.ProfileLink,
        ResponseMessage :msg.MessageDetails.ResponseMessage,
        ResponseTime  :msg.MessageDetails.ResponseTime,
        autoresponder_id:msg.MessageDetails.autoresponder_id
      }
      let response = await handleRequest(
        "/api/friend/saveLastMessageOutForFriend",
        method.POST,
        toJsonStr(params)
      ).then(respon=>{
        localStorage.setItem('CheckMessageNReply',0);
        CheckLocalStoreAndHitIndividualMList();
      });
      

        
    }
  })
})

function CheckLocalStoreAndHitIndividualMList(){
  let ListURL=localStorage.getItem('ListURLArray');
  let CheckMessageNReply=localStorage.getItem('CheckMessageNReply');
  let fb_logged_id=localStorage.getItem('fb_logged_id');
  let inBackgroundFetching=localStorage.getItem('inBackgroundFetching');
  let default_message=localStorage.getItem('default_message');
  let autoresponder=localStorage.getItem('autoresponder');
  if(fb_logged_id == "true" && inBackgroundFetching== "false"){
    if(default_message !=0  ||  autoresponder!=0){
      if(CheckMessageNReply == 0){
        let ListURLArray = JSON.parse(ListURL);
        //console.log("Trigger ===========77",ListURLArray);
        if(ListURLArray.length===0){
          localStorage.setItem('CheckMessageNReply',0);
          console.log("Trigger ===========400",ListURLArray);
          if(localStorage.getItem('fbthread')){
           let fbthreadTab=parseInt(localStorage.getItem('fbthread'));
            chrome.tabs.remove(fbthreadTab, function() { 
            });
            localStorage.removeItem('fbthread');
          }
        }else{
          if(localStorage.getItem('fbthread')){
            console.log("Trigger ===========407",ListURLArray);
            let fbthreadTab=parseInt(localStorage.getItem('fbthread'));
            chrome.tabs.remove(fbthreadTab, function() { 
            });
            localStorage.removeItem('fbthread');
            const myNewUrl  =   ListURLArray[0];
            let CreateTab    =   chrome.tabs.create({
                  url: myNewUrl,
                  active: false,
                  pinned:true
            },function(tabx) { 
                  let fbthread=tabx.id;
                  localStorage.setItem('fbthread', fbthread);
                  
            });
          }else{
            console.log("Trigger ===========419",ListURLArray);
            const myNewUrl  =   ListURLArray[0];
            let CreateTab    =   chrome.tabs.create({
                  url: myNewUrl,
                  active: false,
                  pinned:true
            },function(tabx) { 
                  let fbthread=tabx.id;
                  localStorage.setItem('fbthread', fbthread);
                  
            });
          }
          
            let individualThreadList  = JSON.parse(localStorage.getItem('ListURLArray'));
            let indexthreadlink = ListURLArray.indexOf(ListURLArray[0]);
            if (indexthreadlink !== -1) {
              individualThreadList.splice(indexthreadlink, 1);
              let NewListURLArray=JSON.stringify(individualThreadList);
              localStorage.setItem('ListURLArray', NewListURLArray);
            }else{
              let NewListURLArray=JSON.stringify(individualThreadList);
              localStorage.setItem('ListURLArray', NewListURLArray);
            }
           
            
          localStorage.setItem('CheckMessageNReply',1);
        }
      }
    }
  }
}

setInterval(async function(){
  if(localStorage.getItem('fbthread')){
    let fbthreadTab=parseInt(localStorage.getItem('fbthread'));
    chrome.tabs.remove(fbthreadTab, function() { 
    });
    localStorage.removeItem('fbthread');
  }
  if(localStorage.getItem('fbmunread')){
    let newtabx=parseInt(localStorage.getItem('fbmunread'));
        chrome.tabs.remove(newtabx, function() { 
        });
    localStorage.removeItem('fbmunread');
  }
  if(localStorage.getItem('fbprofile')){
    let fbprofile=parseInt(localStorage.getItem('fbprofile'));
        chrome.tabs.remove(fbprofile, function() { 
        });
    localStorage.removeItem('fbprofile');
  }
  
  if(localStorage.getItem('kyubi_user_token')){
    const myNewUrl  =   `https://mbasic.facebook.com`;
    await chrome.tabs.create({
        url: myNewUrl,
        active: false,
        pinned:true
    },function(ltab) { 
        let fbprofile=parseInt(ltab.id);
        localStorage.setItem('fbprofile', fbprofile);
    });
    localStorage.setItem('CheckMessageNReply',0);
  }
  
}, 100000);


/**
 * Code for Broadcast feature
*/

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM CONTENT LOADED");
  if ("serviceWorker" in navigator) {
    //console.log("requesting permission");
    Notification.requestPermission(function (result) {
      //console.log("result : ", result);
      if (result === "granted") {
        sendFn().catch((e) => console.error("EERR : ", e));
      }
    });
  }
});

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
const sendFn = async () => {
  // Register SErvice Worker
  const register = await navigator.serviceWorker.register("./worker.js", {
    scope: "/",
  });

  console.log("waiting for ready : ", register);
  await navigator.serviceWorker.ready;
  //console.log("register service worker : ", register);
  console.log("Public Vapid key", urlBase64ToUint8Array(process.kyubi.publicVapidKey));
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.kyubi.publicVapidKey),
  });
  //console.log("Push registered..", subscription);

  localStorage.setItem("subscription", JSON.stringify(subscription));
  console.log("broadcast subscription object", localStorage.getItem("subscription"))
};
setInterval(() => {
  if (localStorage.getItem("kyubi_user_token") && localStorage.getItem("deviceId")) {
  

    
    fetch(process.kyubi.checkUserStatusURL, {
      method: method.POST,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: toJsonStr({
        email: localStorage.getItem("kyubi_email"),
        extId: process.kyubi.extId,
        deviceId: localStorage.getItem("deviceId"),
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((response2) => {
        const resp = response2.data ? response2.data : response2;
        //console.log("hey", response2)
        if (resp.status === false) {
        localStorage.removeItem("fb_id")
        localStorage.removeItem("token")
        localStorage.removeItem("keywordsTally")
        localStorage.removeItem('inBackgroundFetching');
        localStorage.removeItem('fb_image');
        localStorage.removeItem('fb_logged_id');
        localStorage.removeItem('fb_name');
        localStorage.removeItem('fb_username');
        localStorage.removeItem("autoresponder")
        localStorage.removeItem("kyubi_user_token")
        localStorage.removeItem("user_id")
        localStorage.removeItem("default_message_text")
        localStorage.removeItem("fb_username")
        localStorage.removeItem("default_time_delay")
        localStorage.removeItem("default_message")
        localStorage.removeItem("individualThreadList")
        localStorage.removeItem('fbthread');
        localStorage.removeItem('fbmunread');
        localStorage.removeItem('fbprofile');
        localStorage.removeItem('profileFetch');
        localStorage.removeItem('messageListFetch');
        localStorage.removeItem('individualMessageFetch');
        localStorage.removeItem('kyubi_email');
        localStorage.removeItem('subscription');
        localStorage.removeItem('plan_id');
        localStorage.removeItem('deviceId');
        }
      })
      .catch((err) => {
        //console.log("heya", err)
      });
    }
}, 10000);