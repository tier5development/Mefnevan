const getApiUrl = "https://api.mefnevan.com/"; //"https://api.mefnevan.com" ;
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

chrome.runtime.onMessage.addListener(async function(request, sender) {
  console.log("This is the Request",request)
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
      }
        await handleRequest(
          "api/user/userCheckStoreNRetrive",
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
                      if((AutoResponderStatus == 1 || DefaultMessageStatus == 1) && UserLoggedInFacebook== true && BackGroundFetchingStatus==  false ){
                        if(localStorage.getItem('fbmunread')){
                          let newtab=parseInt(localStorage.getItem('fbmunread'));
                          chrome.tabs.get(newtab, function(tab) {
                            if (!tab) { 
                              console.log('tab does not exist'); 
                              const myNewUrl  =   `https://m.facebook.com/messages/`;
                              let CreateTab    =   chrome.tabs.create({
                                  url: myNewUrl,
                                  active: false,
                                  pinned:true
                              },function(tab) { 
                                  let fbmunread=tab.id;
                                  localStorage.setItem('fbmunread', fbmunread);
                              });
                            }
                          })
                        }else{
                            const myNewUrl  =   `https://m.facebook.com/messages/`;
                            let CreateTab    =   chrome.tabs.create({
                                  url: myNewUrl,
                                  active: false,
                                  pinned:true
                            },function(tab) { 
                                  let fbmunread=tab.id;
                                  localStorage.setItem('fbmunread', fbmunread);
                            });
                        }
                      }
                      
        }).catch(error=>{
          console.log("We are really Sorry we found error in fetching the Profile Info",error);
        })
  }else if(request.type == "StoreMessageLinkInLocalStorage"){
      let ListURL=localStorage.getItem('ListURLArray');
      let ListURLArray=JSON.parse(ListURL);
      if(ListURLArray.length  === 0){
        ListURLArray[ListURLArray.length]=mBasicUrl+""+request.options;
        let NewListURLArray=JSON.stringify(ListURLArray);
        localStorage.setItem('ListURLArray', NewListURLArray);
      }else{
        let check = ListURLArray.includes(mBasicUrl+""+request.options);
        if(check){

        }else{
          ListURLArray[ListURLArray.length]=mBasicUrl+""+request.options;
          let NewListURLArray=JSON.stringify(ListURLArray);
          localStorage.setItem('ListURLArray', NewListURLArray);
        }
      }
      CheckLocalStoreAndHitIndividualMList();
  }
});

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(async function(msg) {
    if(msg.ConFlag == "CheckMessageContent"){
      console.log("Now  Again I am In BackGround xxxxxxxxxxxxxxxxxxxx",msg.MessageDetails);
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
                console.log("I am Hear 156");
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
                  console.log("I am Hear 187");
                    FriendFullName.map(function(eachval){
                        if(FirstCountx ===   0){
                            FriendFirstName = eachval;
                        }else{
                            FriendLastName=FriendLastName+" "+eachval;
                        }
                        FirstCountx=FirstCountx+1;
                      });
                }else{
                  console.log("I am Hear 197");
                    FriendFirstName = FriendFullName;
                }
                let totalkeyObj =keyObj.length;
                if(totalkeyObj == 0){
                  console.log("I am Hear 202");
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
                    "api/friend/checkFriendReadyToReciveDefaultMessage",
                    method.POST,
                    toJsonStr(paramsToSend)
                    );
                  let responsenewvalue = await response.json();
                  console.log("Hit For Default",paramsToSend);
                  console.log("Hit For Default Now Get From Backend",responsenewvalue);
                  //TODO CLEAR AND HIT DEFAULT
                  // if(localStorage.getItem('fbprofile')){
                  //   let newtab=parseInt(localStorage.getItem('fbprofile'));
                  //   chrome.tabs.get(newtab, function(tab) {
                  //     if (!tab) { 
                  //       console.log('tab does not exist'); 
                  //     }else{
                  //       let myMessageUrl  =   `https://mbasic.facebook.com`;
                  //       chrome.tabs.update(newtab, 
                  //       {
                  //         url: myMessageUrl
                  //       },function(tabx) {
                  //         let fbprofile=tabx.id;
                  //         localStorage.setItem('fbprofile', fbprofile);
                  //       });
                  //     }
                  //   });
                  // }else{
                  //   console.log('fbprofile does not exist');
                  // }
                  localStorage.setItem('CheckMessageNReply',0);
                  CheckLocalStoreAndHitIndividualMList();
                }else{
                  console.log("I am Hear 221");
                  let ResponseTextArray=[];
                  let ResponseText="";
                  await keyObj.map(function(eachval){
                    let keywordToFind =eachval.keyword.toLowerCase();
                        keywordToFind = " "+keywordToFind+" ";
                        if (IncomingMessage.indexOf(keywordToFind)!=-1)
                        {
                          console.log("KEEEEEEEEEEEEE",keywordToFind);
                              let PointIndex=IncomingMessage.indexOf(keywordToFind);
                              ResponseTextArray[PointIndex] = eachval.message
                              
                        }
                  });
                  console.log("Thisissssssssssssss Messahe array",ResponseTextArray)
                  if(ResponseTextArray.length === 0){
                    let paramsToSend  =   {
                      MfenevanId:MfenevanId,
                      FacebookUserId:FacebookUserId,
                      FriendFacebookId:FacebooKFriendId,
                      FacebookFirstName:FriendFirstName,
                      FacebookLastName:FriendLastName,
                      ProfileLink:ProfileLink,
                      TimeNow:NowTime
                    }
                    //TODO DEFAULT
                    let response  = await handleRequest(
                      "api/friend/checkFriendReadyToReciveDefaultMessage",
                      method.POST,
                      toJsonStr(paramsToSend)
                      );
                    let responsenewvalue = await response.json();
                    if(responsenewvalue.code == 1){
                      console.log("Hey I am Sending This-----------------------",paramsToSend);
                      port.postMessage({userInfoDetails: responsenewvalue.payload.message,ThreadParams:paramsToSend,ConFlagBack:"DEFAULTMESSAGEBACK" });
                    }else{
                      // if(localStorage.getItem('fbprofile')){
                      //   let newtab=parseInt(localStorage.getItem('fbprofile'));
                      //   chrome.tabs.get(newtab, function(tab) {
                      //     if (!tab) { 
                      //       console.log('tab does not exist'); 
                      //     }else{
                      //       let myMessageUrl  =   `https://mbasic.facebook.com`;
                      //       chrome.tabs.update(newtab, 
                      //       {
                      //         url: myMessageUrl
                      //       },function(tabx) {
                      //         let fbprofile=tabx.id;
                      //         localStorage.setItem('fbprofile', fbprofile);
                      //       });
                      //     }
                      //   });
                      // }else{
                      //   console.log('fbprofile does not exist');
                      // }
                      localStorage.setItem('CheckMessageNReply',0);
                      CheckLocalStoreAndHitIndividualMList();
                    }
                  }else{
                    console.log("ThisissssssssssssssYYYYYYYYYYYYYYY Messahe array",ResponseTextArray);
                    let myArray = ResponseTextArray;
                    let unique = myArray.filter((v, i, a) => a.indexOf(v) === i);

                    console.log("ThisissssssssssssssXXXXXXXXXXXXXXX Messahe array",unique); 
                    unique.map(eachRespo=>{
                      ResponseText=ResponseText+" "+eachRespo;
                    });
                        let a = new Date(NowTime);
                        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        let year = a.getFullYear();
                        let month = months[a.getMonth()];
                        let date = a.getDate();
                        let hour = a.getHours();
                        let min = a.getMinutes();
                        let sec = a.getSeconds();
                        let OnlyDate = date + ' ' + month + ' ' + year ;
                        let NewResponseText = ResponseText.split('{first_name}').join(FriendFirstName);
                        NewResponseText = NewResponseText.split('{last_name}').join(FriendLastName);
                        NewResponseText = NewResponseText.split('{Date}').join(OnlyDate);
                        NewResponseText = NewResponseText.split('{date}').join(OnlyDate);
                        console.log("Message Array IS++++++++++++++++++++++++",NewResponseText);
                        let paramsToSend  =   {
                          MfenevanId:MfenevanId,
                          FacebookUserId:FacebookUserId,
                          FriendFacebookId:FacebooKFriendId,
                          FacebookFirstName:FriendFirstName,
                          FacebookLastName:FriendLastName,
                          ProfileLink:ProfileLink,
                          TimeNow:NowTime,
                          ResponseMessage:NewResponseText
                        }
                        console.log("Hey I am Sending This------------------",paramsToSend);
                        port.postMessage({userInfoDetails: NewResponseText,ThreadParams:paramsToSend,ConFlagBack:"AUTOMESSAGEBACK" });

                        //chrome.runtime.sendMessage({type: "SENDMESSAGETOUSER", options: paramsToSend});

                      }
                }
          }else{
            //TODO CLEAR
            // if(localStorage.getItem('fbprofile')){
            //   let newtab=parseInt(localStorage.getItem('fbprofile'));
            //   chrome.tabs.get(newtab, function(tab) {
            //     if (!tab) { 
            //       console.log('tab does not exist'); 
            //     }else{
            //       let myMessageUrl  =   `https://mbasic.facebook.com`;
            //       chrome.tabs.update(newtab, 
            //       {
            //         url: myMessageUrl
            //       },function(tabx) {
            //         let fbprofile=tabx.id;
            //         localStorage.setItem('fbprofile', fbprofile);
            //       });
            //     }
            //   });
            // }else{
            //   console.log('fbprofile does not exist');
            // }
            localStorage.setItem('CheckMessageNReply',0);
            CheckLocalStoreAndHitIndividualMList();
            }
        }else{
          //TODO CLEAR
          // if(localStorage.getItem('fbprofile')){
          //   let newtab=parseInt(localStorage.getItem('fbprofile'));
          //   chrome.tabs.get(newtab, function(tab) {
          //     if (!tab) { 
          //       console.log('tab does not exist'); 
          //     }else{
          //       let myMessageUrl  =   `https://mbasic.facebook.com`;
          //       chrome.tabs.update(newtab, 
          //       {
          //         url: myMessageUrl
          //       },function(tabx) {
          //         let fbprofile=tabx.id;
          //         localStorage.setItem('fbprofile', fbprofile);
          //       });
          //     }
          //   });
          // }else{
          //   console.log('fbprofile does not exist');
          // }
          localStorage.setItem('CheckMessageNReply',0);
          CheckLocalStoreAndHitIndividualMList();
        }
        
      }else{
        // if(localStorage.getItem('fbprofile')){
        //   let newtab=parseInt(localStorage.getItem('fbprofile'));
        //   chrome.tabs.get(newtab, function(tab) {
        //     if (!tab) { 
        //       console.log('tab does not exist'); 
        //     }else{
        //       let myMessageUrl  =   `https://mbasic.facebook.com`;
        //       chrome.tabs.update(newtab, 
        //       {
        //         url: myMessageUrl
        //       },function(tabx) {
        //         let fbprofile=tabx.id;
        //         localStorage.setItem('fbprofile', fbprofile);
        //       });
        //     }
        //   });
        // }else{
        //   console.log('fbprofile does not exist');
        // }
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
        ResponseTime  :msg.MessageDetails.ResponseTime
      }
      let response = await handleRequest(
        "api/friend/saveLastMessageOutForFriend",
        method.POST,
        toJsonStr(params)
      ).then(respon=>{
        localStorage.setItem('CheckMessageNReply',0);
        CheckLocalStoreAndHitIndividualMList();
      });
      

        
    }
    if(msg.ConFlag == "StoreMessageLinkInLocalStorage"){
      console.log("Store In Array",msg);
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
        console.log("Trigger ===========77",ListURLArray);
        if(ListURLArray.length===0){
          localStorage.setItem('CheckMessageNReply',0);
        }else{
          let fbprofile=parseInt(localStorage.getItem('fbprofile'));
          let myMessageUrl  =   ListURLArray[0];
          chrome.tabs.update(fbprofile, 
            {
              url: myMessageUrl
            },function(tab) {
              let fbthread=tab.id;
              localStorage.setItem('fbthread', fbthread);
            });
            let individualThreadList  = JSON.parse(localStorage.getItem('ListURLArray'));
            let indexthreadlink = ListURLArray.indexOf(myMessageUrl);
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
// function restartTabfun(){
//   if(localStorage.getItem('fbprofile')){
//     let newtab=parseInt(localStorage.getItem('fbprofile'));
//     chrome.tabs.get(newtab, function(tab) {
//       if (!tab) { 

//       }
//       else{
//             chrome.tabs.remove(newtab, function() { 
//                 localStorage.removeItem('fbprofile');
//             });
//       }
//     })
//   }
//   if(localStorage.getItem('fbmunread')){
//       let newtabx=parseInt(localStorage.getItem('fbmunread'));
//       chrome.tabs.get(newtabx, function(tab) {
//         if (!tab) { 

//         }
//         else{
//           chrome.tabs.remove(newtabx, function() { 
//             localStorage.removeItem('fbmunread');
//           });
//         }
//       })
//   }
//   chrome.tabs.query({},function(tabs){     
//     console.log("\n/////////////////////\n");
//     tabs.forEach(function(tab){
//       console.log(tab.url," and ID is",tab.id);
//       if(tab.url == "https://mbasic.facebook.com/"){
//         chrome.tabs.remove(tab.id, function() { 
//           //localStorage.removeItem('fbprofile');
//         });
//       }
//     });
//  });
//   localStorage.setItem('CheckMessageNReply',0);
//   localStorage.removeItem('fbthread');
//   const myNewUrl  =   `https://mbasic.facebook.com`;
//   let CreateTab    =   chrome.tabs.create({
//       url: myNewUrl,
//       active: false,
//       pinned:true
//   },function(tab) { 
//       let fbprofile=tab.id;
//       localStorage.setItem('fbprofile', fbprofile);
//       CheckLocalStoreAndHitIndividualMList();
//   });
  
// }

setInterval(async function(){
  //restartTabfun()

  if(localStorage.getItem('fbmunread')){
      let newtabx=parseInt(localStorage.getItem('fbmunread'));
     
          chrome.tabs.remove(newtabx, function() { 
            localStorage.removeItem('fbmunread');
          });
       
  }
  if(localStorage.getItem('fbthread')){
    let newtax=parseInt(localStorage.getItem('fbthread'));

        chrome.tabs.remove(newtax, function() { 
          localStorage.removeItem('fbthread');
        });
    
}
await chrome.tabs.query({},async function(tabs){     
    console.log("\n/////////////////////\n");
    await tabs.forEach(function(tab){
      console.log(tab.url," and ID is",tab.id);
      if(tab.url == "https://mbasic.facebook.com/"){
        chrome.tabs.remove(tab.id, function() { 
          //localStorage.removeItem('fbprofile');
        });
      }
      var inputString = tab.url ;
var findme = "https://m.facebook.com/messages/read/?";

if ( inputString.indexOf(findme) > -1 ) {
  chrome.tabs.remove(tab.id, function() { 
    //localStorage.removeItem('fbprofile');
  });
} else {
    //alert( "not found" );
}
    });
});
const myNewUrl  =   `https://mbasic.facebook.com`;
await chrome.tabs.create({
    url: myNewUrl,
    active: false,
    pinned:true
},function(ltab) { 
    let fbprofile=parseInt(ltab.id);
    console.log("I am setttinggg");
    localStorage.setItem('fbprofile', fbprofile);
    
});
localStorage.setItem('CheckMessageNReply',0);

//CheckLocalStoreAndHitIndividualMList();
}, 60000)
