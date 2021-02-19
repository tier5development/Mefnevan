const getUserToken = () => localStorage.getItem("token");
console.log("I am background");

const method = { POST: "post", GET: "get", PUT: "put", DELETE: "delete" };
const toJsonStr = (val) => JSON.stringify(val);

const getApiUrl = 'http://localhost:8080';
const mBasicUrl = 'https://mbasic.facebook.com';
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
 * this will listen to the  URL and Take decission depending on the URL and tallying  windowID in localstore
 * 
*/
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    /**
     * Once the window is loaded
     */
    if (changeInfo.status === 'complete') {
        console.log(tab.windowId);
            let WindowURL   =   tab.url
            let WindowId    =   tab.windowId;
            let TabId   =   tab.id;
            let WindowIdString  =   String(tab.windowId);
            let TabIdString =   String(tab.id);
            let CheckProfileIDPresent   =   false;
            let CheckMListIDPresent   =   false;
            let CheckMThreadIDPresent   =   false;
            let UserToken=getUserToken();
            let FaceBookUsername    =   localStorage.getItem('fb_username');
            let IsFaceBookLoggedIn  =   localStorage.getItem('fb_logged_id');
            let DefaultMessageState =   localStorage.getItem('default_message');
            let DefaultMessageTexting   =   localStorage.getItem('default_message_text');
            let AutoresponderStatus =   localStorage.getItem('autoresponder');
            let DefaultMessageTimeDelay =   localStorage.getItem('default_time_delay');
            let AutoResponderKeyword    =   localStorage.getItem('keywordsTally');
            let MfenevanId    =   localStorage.getItem('user_id');
            let FacebookUserId    =   localStorage.getItem('fb_id'); 
        //For Checking Profile WindowId Stored In Local Store
            let fbprofile=localStorage.getItem('fbprofile');
            if(fbprofile){
                let resfbprofile = fbprofile.split(",");
                CheckProfileIDPresent   =  resfbprofile.includes(WindowIdString);
            }
             
        
        //For Checking message List WindowId Stored In Local Store
            let fbmunread=localStorage.getItem('fbmunread');
            if(fbmunread){
                let resfbmunread = fbmunread.split(",");
                CheckMListIDPresent   =  resfbmunread.includes(WindowIdString);
            }
            

        //For Checking message Tread WindowId Stored In Local Store    
            let fbthread=localStorage.getItem('fbthread');
            if(fbthread){
                console.log("Hello1",fbthread);
                let resfbthread = fbthread.split(",");
                CheckMThreadIDPresent   =  resfbthread.includes(WindowIdString);
                console.log("Hello2",CheckMThreadIDPresent);
            }
            

        if(tab.url === 'https://mbasic.facebook.com/' && CheckProfileIDPresent==true){
            console.log("Yes the Profile is there Suvadeep");
            console.log("This is info from background",tab);
            data={userToken:UserToken,tabinfo:TabId,windowinfo:WindowId}
            console.log(data);
            
            
            chrome.tabs.sendMessage(TabId, { catch: "get-login-info",data });
        }else if(tab.url === 'https://mbasic.facebook.com/messages' && CheckMListIDPresent==true){
            console.log("Yes the Message List is there");
            data={userToken:UserToken,tabinfo:TabId,windowinfo:WindowId}
            console.log(data);
            chrome.tabs.sendMessage(TabId, { catch: "check-new-incoming-messag",data });
        }else if(tab.url.includes('https://mbasic.facebook.com/messages/read/?tid=cid') && CheckMThreadIDPresent==true){
            console.log("Yes the Individual Message Thread is there");
            data={
                userToken:UserToken,
                tabinfo :   TabId,
                windowinfo  :   WindowId,
                MfenevanId  :   MfenevanId,
                FacebookUserId  :   FacebookUserId, 
                FaceBookUsername    :   FaceBookUsername,
                IsFaceBookLoggedIn  :   IsFaceBookLoggedIn,
                DefaultMessageState :   DefaultMessageState,
                DefaultMessageTexting   :   DefaultMessageTexting,
                AutoresponderStatus :   AutoresponderStatus,
                DefaultMessageTimeDelay :   DefaultMessageTimeDelay,
                AutoResponderKeyword    :   AutoResponderKeyword,
                WindowURL   :   WindowURL
            }
            console.log(data);
            chrome.tabs.sendMessage(tab.id, { catch: "read-chat-thread-contents",data });
        }
    }
});
/** 
 * this will listen to the  on runtime Message
 * 
*/
chrome.runtime.onMessage.addListener(async function(request, sender) {
        let WindowId    =   request.options.windowinfo;
        let TabId   =   request.options.tabinfo;
    if (request.type == "storeUserInfoOrQueryThenStore"){
            let UserKyubiToken  =   request.options.token;
            let UserFacebookid  =   request.options.fb_id;
            let UserFacebookUsername    =   request.options.fb_username;
            let UserFacebookName    = request.options.fb_name;
            let UserFacebookImage   =   request.options.fb_image;
            let UserLoggedInFacebook    =   request.options.fb_logged_id;
            let DefaultMessageStatus    =   0;   
            let DefaultMessageText    =   "";
            let AutoResponderStatus    =   0;
            let DefaultMessageDelayTime    =   0;
            let AutoResponderKeywords    =   JSON.stringify([]);
            let BackGroundFetchingStatus    =   true;
            let MfenevanUserId  =   "";
            if(request.options.fb_logged_id===true){
                console.log("This to store or Query then store 1 ",request.options);
                let  params ={
                    user_rec    :   UserKyubiToken,
                    fb_id   :   UserFacebookid,
                    fb_username :   UserFacebookUsername,
                    fb_name :   UserFacebookName,
                    fb_image    :   UserFacebookImage,
                    fb_logged_id    :   BackGroundFetchingStatus
                }
                await handleRequest(
                    "api/user/userfacebook",
                    method.POST,
                    toJsonStr(params)
                    ).then(async response =>  {
                        let responsenewvalue = await response.json();
                        console.log(responsenewvalue);
                        UserFacebookid  =   responsenewvalue.payload.UserInfo.facebook_id;
                        UserFacebookUsername    =   responsenewvalue.payload.UserInfo.facebook_name;
                        UserFacebookName    = responsenewvalue.payload.UserInfo.facebook_profile_name;
                        UserFacebookImage   =   responsenewvalue.payload.UserInfo.facebook_image;
                        DefaultMessageStatus    =   responsenewvalue.payload.UserSettings.default_message;   
                        DefaultMessageText    =   responsenewvalue.payload.UserSettings.default_message_text;
                        AutoResponderStatus    =   responsenewvalue.payload.UserSettings.autoresponder;
                        DefaultMessageDelayTime    =   responsenewvalue.payload.UserSettings.default_time_delay;
                        AutoResponderKeywords    =   JSON.stringify(responsenewvalue.payload.AutoResponderKeywords);
                        BackGroundFetchingStatus    =   false;
                        MfenevanUserId  =   responsenewvalue.payload.UserInfo.user_id;
                    });
            }else{
                console.log("This to store or Query then store 2 ",request.options);
                let  params ={
                    user_rec    :   UserKyubiToken,
                }
                await handleRequest(
                    "api/user/getUserDetails",
                    method.POST,
                    toJsonStr(params)
                    ).then(async response =>  {
                        let responsenewvalue = await response.json();
                        console.log(responsenewvalue);
                        UserFacebookid  =   responsenewvalue.payload.UserInfo.facebook_fbid;
                        UserFacebookUsername    =   responsenewvalue.payload.UserInfo.facebook_name;
                        UserFacebookName    = responsenewvalue.payload.UserInfo.facebook_profile_name;
                        UserFacebookImage   =   responsenewvalue.payload.UserInfo.facebook_image;
                        DefaultMessageStatus    =   responsenewvalue.payload.UserSettings.default_message;   
                        DefaultMessageText    =   responsenewvalue.payload.UserSettings.default_message_text;
                        AutoResponderStatus    =   responsenewvalue.payload.UserSettings.autoresponder;
                        DefaultMessageDelayTime    =   responsenewvalue.payload.UserSettings.default_time_delay;
                        AutoResponderKeywords    =   JSON.stringify(responsenewvalue.payload.AutoResponderKeywords);
                        BackGroundFetchingStatus    =   false;
                        MfenevanUserId  =   responsenewvalue.payload.UserInfo.user_id;
                    });
            }
            localStorage.setItem('kyubi_user_token', UserKyubiToken);
            localStorage.setItem('user_id', MfenevanUserId);
            localStorage.setItem('fb_id', UserFacebookid);
            localStorage.setItem('fb_username', UserFacebookUsername);
            localStorage.setItem('fb_name', UserFacebookName);
            localStorage.setItem('fb_image', UserFacebookImage);
            localStorage.setItem('fb_logged_id', UserLoggedInFacebook);
            localStorage.setItem('inBackgroundFetching', BackGroundFetchingStatus);
            localStorage.setItem('default_message', DefaultMessageStatus);
            localStorage.setItem('default_message_text', DefaultMessageText);
            localStorage.setItem('autoresponder', AutoResponderStatus);
            localStorage.setItem('default_time_delay', DefaultMessageDelayTime);
            localStorage.setItem('keywordsTally', AutoResponderKeywords);
            localStorage.removeItem("fbprofile");
            chrome.tabs.remove(TabId);
            chrome.windows.remove(WindowId);
            console.log("AutoResponderStatus",AutoResponderStatus);
            console.log("UserLoggedInFacebook",UserLoggedInFacebook);
            console.log("BackGroundFetchingStatus",BackGroundFetchingStatus);
            if(AutoResponderStatus===1 && UserLoggedInFacebook===true && BackGroundFetchingStatus  ===false){
                console.log("Now Trigger The Chtwindow");
                let myNewmessageUrl = `https://mbasic.facebook.com/messages`;
                chrome.windows.create({
                                        url: myNewmessageUrl,
                                        type: "popup",
                                        height: 1,
                                        width:1,
                                        focused: false
                                    },function(tab) { 
                                        let fbmunread=localStorage.getItem('fbmunread');
                                        if(fbmunread){
                                            fbmunread=fbmunread+tab.id+",";
                                        }else{
                                            fbmunread=tab.id+",";
                                        }
                                        localStorage.setItem('fbmunread', fbmunread);
                                    });
            }
    }else if(request.type  == "OpenIndividualMessageThenCloseAndReopenMessageList"){
        console.log("From Message List I Got",request.options);
        
        chrome.tabs.remove(TabId);
        chrome.windows.remove(WindowId);
        
        localStorage.removeItem("fbmunread");
        let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
        let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
        let AutoResponderStatus=localStorage.getItem('autoresponder');
        if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
        request.options.individualThreadList.map(function(eachval){
            //console.log("EachUrl ====>",eachval);
            let NewUrl  =   mBasicUrl+eachval;
            chrome.windows.create({
                url: NewUrl,
                type: "popup",
                height: 1,
                width:1,
                focused: false
            },function(tab) { 
                let fbthread=localStorage.getItem('fbthread');
                if(fbthread){
                    fbthread=fbthread+tab.id+",";
                }else{
                    fbthread=tab.id+",";
                }
                localStorage.setItem('fbthread', fbthread);
            });
        })
        }
        
        
        console.log("AutoResponderStatus",AutoResponderStatus);
        console.log("UserLoggedInFacebook",UserLoggedInFacebook);
        console.log("BackGroundFetchingStatus",BackGroundFetchingStatus);
        if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
            setTimeout(() => {
                let myNewmessageUrl = `https://mbasic.facebook.com/messages`;
                chrome.windows.create({
                                        url: myNewmessageUrl,
                                        type: "popup",
                                        height: 1,
                                        width:1,
                                        focused: false
                                    },function(tab) { 
                                        let fbmunread=localStorage.getItem('fbmunread');
                                        if(fbmunread){
                                            fbmunread=fbmunread+tab.id+",";
                                        }else{
                                            fbmunread=tab.id+",";
                                        }
                                        localStorage.setItem('fbmunread', fbmunread);
                                    });
            }, 4000);
        }
        

    }else if(request.type   ==  "CloseTheIndividualMessageThread"){
        let fbthread=localStorage.getItem('fbthread');
        let removestring=WindowId+","
        let Newfbthread = fbthread.split(removestring).join("");
        localStorage.removeItem("fbthread");
        chrome.tabs.remove(TabId);
        chrome.windows.remove(WindowId);
    }else if(request.type   ==  "CheckWetherUserEligibleForDefaultMessage"){
        console.log("For Default Message",request.options);
        let userToken  =   localStorage.getItem('token');
        let MfenevanId  =   localStorage.getItem('user_id');
        let FacebookUserId  =   localStorage.getItem('fb_id');
        let DefaultMessageStatus    =   localStorage.getItem('default_message');
        let DefaultMessageTexting   =   localStorage.getItem('default_message_text');
        let AutoresponderStatus =   localStorage.getItem('autoresponder');
        let DefaultMessageTimeDelay =   localStorage.getItem('default_time_delay');
        let FriendFacebookId    =   request.options.FriendFacebookId;
        let ProfileLink    =   request.options.ProfileLink;
        let ProfileName    =   request.options.ProfileName;
        let TimeNow =   request.options.TimeNow;
        if(DefaultMessageStatus ==  "1" && AutoresponderStatus  ==  "1"){
            let params  =   {
                MfenevanId:MfenevanId,
                FacebookUserId:FacebookUserId,
                DefaultMessageStatus:DefaultMessageStatus,
                DefaultMessageTexting:DefaultMessageTexting,
                AutoresponderStatus:AutoresponderStatus,
                DefaultMessageTimeDelay:parseInt(DefaultMessageTimeDelay),
                FriendFacebookId:FriendFacebookId,
                ProfileLink:ProfileLink,
                ProfileName:ProfileName,
                TimeNow:parseInt(TimeNow)
            }
            let response = await handleRequest(
                "api/friend/friendsDefaultMessageCheck",
                method.POST,
                toJsonStr(params)
                );
            let responsenewvalue = await response.json();
            console.log("this are the response",responsenewvalue);
            if(responsenewvalue.code==1){
                let paramdata   =   {
                tabinfo:request.options.tabinfo,
                windowinfo:request.options.windowinfo,
                userToken:userToken,
                MfenevanId:MfenevanId,
                FacebookUserId:FacebookUserId,
                DefaultMessageStatus:DefaultMessageStatus,
                DefaultMessageTexting:DefaultMessageTexting,
                AutoresponderStatus:AutoresponderStatus,
                DefaultMessageTimeDelay:DefaultMessageTimeDelay,
                FriendFacebookId:FriendFacebookId,
                ProfileLink:ProfileLink,
                ProfileName:ProfileName,
                TimeNow:TimeNow
                }
                console.log("+++++++++++++++++++++++++",paramdata);
                chrome.tabs.sendMessage(request.options.tabinfo, { catch: "send-default-message-Facebook-User",paramdata });
            }else{
                let fbthread=localStorage.getItem('fbthread');
                let removestring=WindowId+","
                let Newfbthread = fbthread.split(removestring).join("");
                localStorage.removeItem("fbthread");
                chrome.tabs.remove(TabId);
                chrome.windows.remove(WindowId);
                let NewIndividualThreadLinks = [];
                let FirstCount = 0;
                let myNewmessageUrl = "";
                let individualThreadList=localStorage.getItem('individualThreadList');
                let keyObj = JSON.parse(individualThreadList);
                if(keyObj.length !=  0){
                    keyObj.map(function(eachval){
                        if(FirstCount ===   0){
                            console.log("OPen this Link",mBasicUrl+eachval.indvidualURL);
                            myNewmessageUrl = mBasicUrl+eachval.indvidualURL;
                            
                    
                        }else{
                            let MnO={"indvidualURL":eachval.indvidualURL}
                            NewIndividualThreadLinks.push(MnO);
                        }
                        FirstCount=FirstCount+1;
                    });
                    console.log("Store This In DB",NewIndividualThreadLinks);
                    let json_string = JSON.stringify(NewIndividualThreadLinks);
                    localStorage.setItem('individualThreadList', json_string);
                    let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
                    let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
                    let AutoResponderStatus=localStorage.getItem('autoresponder');
                    if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
                        chrome.windows.create({
                            url: myNewmessageUrl,
                            type: "popup",
                            height: 1,
                            width:1,
                            focused: false
                        },function(tab) { 
                            let fbthread=localStorage.getItem('fbthread');
                            if(fbthread){
                                fbthread=fbthread+tab.id+",";
                            }else{
                                fbthread=tab.id+",";
                            }
                            localStorage.setItem('fbthread', fbthread);
                        });
                    }
                }else{
                    let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
                    let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
                    let AutoResponderStatus=localStorage.getItem('autoresponder');
                    if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
                        console.log("Now Trigger The Chtwindow");
                        let myNewmessageUrl = `https://mbasic.facebook.com/messages`;
                        chrome.windows.create({
                                                url: myNewmessageUrl,
                                                type: "popup",
                                                height: 1,
                                                width:1,
                                                focused: false
                                            },function(tab) { 
                                                let fbmunread=localStorage.getItem('fbmunread');
                                                if(fbmunread){
                                                    fbmunread=fbmunread+tab.id+",";
                                                }else{
                                                    fbmunread=tab.id+",";
                                                }
                                                localStorage.setItem('fbmunread', fbmunread);
                                            });
                    }
                }
            }
        }else{
            let fbthread=localStorage.getItem('fbthread');
            let removestring=WindowId+","
            let Newfbthread = fbthread.split(removestring).join("");
            localStorage.removeItem("fbthread");
            chrome.tabs.remove(TabId);
            chrome.windows.remove(WindowId);
            let NewIndividualThreadLinks = [];
            let FirstCount = 0;
            let myNewmessageUrl = "";
            let individualThreadList=localStorage.getItem('individualThreadList');
            let keyObj = JSON.parse(individualThreadList);
            if(keyObj.length !=  0){
                keyObj.map(function(eachval){
                    if(FirstCount ===   0){
                        console.log("OPen this Link",mBasicUrl+eachval.indvidualURL);
                        myNewmessageUrl = mBasicUrl+eachval.indvidualURL;
                        
                
                    }else{
                        let MnO={"indvidualURL":eachval.indvidualURL}
                        NewIndividualThreadLinks.push(MnO);
                    }
                    FirstCount=FirstCount+1;
                });
                console.log("Store This In DB",NewIndividualThreadLinks);
                let json_string = JSON.stringify(NewIndividualThreadLinks);
                localStorage.setItem('individualThreadList', json_string);
                let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
                let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
                let AutoResponderStatus=localStorage.getItem('autoresponder');
                if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
                    chrome.windows.create({
                        url: myNewmessageUrl,
                        type: "popup",
                        height: 1,
                        width:1,
                        focused: false
                    },function(tab) { 
                        let fbthread=localStorage.getItem('fbthread');
                        if(fbthread){
                            fbthread=fbthread+tab.id+",";
                        }else{
                            fbthread=tab.id+",";
                        }
                        localStorage.setItem('fbthread', fbthread);
                    });
                }
            }else{
                let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
                let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
                let AutoResponderStatus=localStorage.getItem('autoresponder');
                if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
                    console.log("Now Trigger The Chtwindow");
                    let myNewmessageUrl = `https://mbasic.facebook.com/messages`;
                    chrome.windows.create({
                                            url: myNewmessageUrl,
                                            type: "popup",
                                            height: 1,
                                            width:1,
                                            focused: false
                                        },function(tab) { 
                                            let fbmunread=localStorage.getItem('fbmunread');
                                            if(fbmunread){
                                                fbmunread=fbmunread+tab.id+",";
                                            }else{
                                                fbmunread=tab.id+",";
                                            }
                                            localStorage.setItem('fbmunread', fbmunread);
                                        });
                }
            }
        }
    }else if(request.type   ==  "CloseAndSaveTheLastMessageOut"){
        console.log("Save and Close the Windows  ,So Params are",request.options);
            let DefaultMessageLastTime=request.options.DefaultMessageLastTime;
            let FacebookUserId=request.options.FacebookUserId;
            let FriendFacebookId=request.options.FriendFacebookId;
            let LastContactOutGoing=request.options.LastContactOutGoing;
            let MfenevanId=request.options.MfenevanId;
            let ProfileLink=request.options.ProfileLink;
            let ProfileName=request.options.ProfileName;
            let tabinfo=request.options.tabinfo;
            let windowinfo=request.options.windowinfo;
            let params  =   {
                DefaultMessageLastTime:DefaultMessageLastTime,
                FacebookUserId:FacebookUserId,
                FriendFacebookId:FriendFacebookId,
                LastContactOutGoing:LastContactOutGoing,
                MfenevanId:MfenevanId,
                ProfileLink:ProfileLink,
                ProfileName:ProfileName
            }
            let response = await handleRequest(
                "api/friend/friendsSaveLastMessageOut",
                method.POST,
                toJsonStr(params)
                );
            let responsenewvalue = await response.json();
            console.log("this are the response",responsenewvalue);
            if(responsenewvalue.code==1){
                let fbthread=localStorage.getItem('fbthread');
                let removestring=windowinfo+","
                let Newfbthread = fbthread.split(removestring).join("");
                localStorage.setItem('fbthread', Newfbthread);
                chrome.tabs.remove(tabinfo);
                chrome.windows.remove(windowinfo);
            }else{
                let fbthread=localStorage.getItem('fbthread');
                let removestring=windowinfo+","
                let Newfbthread = fbthread.split(removestring).join("");
                localStorage.setItem('fbthread', Newfbthread);
                chrome.tabs.remove(tabinfo);
                chrome.windows.remove(windowinfo);
            }
    }else if(request.type   ==  "CloseAndSaveTheLastMessageOutAndOpenNew"){
        console.log("Save and Close the Windows  ,So Params are",request.options);
        let DefaultMessageLastTime=request.options.DefaultMessageLastTime;
            let FacebookUserId=request.options.FacebookUserId;
            let FriendFacebookId=request.options.FriendFacebookId;
            let LastContactOutGoing=request.options.LastContactOutGoing;
            let MfenevanId=request.options.MfenevanId;
            let ProfileLink=request.options.ProfileLink;
            let ProfileName=request.options.ProfileName;
            let tabinfo=request.options.tabinfo;
            let windowinfo=request.options.windowinfo;
            let params  =   {
                DefaultMessageLastTime:DefaultMessageLastTime,
                FacebookUserId:FacebookUserId,
                FriendFacebookId:FriendFacebookId,
                LastContactOutGoing:LastContactOutGoing,
                MfenevanId:MfenevanId,
                ProfileLink:ProfileLink,
                ProfileName:ProfileName
            }
            let response = await handleRequest(
                "api/friend/friendsSaveLastMessageOut",
                method.POST,
                toJsonStr(params)
                );
            let responsenewvalue = await response.json();
            console.log("this are the response",responsenewvalue);
            
                let fbthread=localStorage.getItem('fbthread');
                let removestring=windowinfo+","
                let Newfbthread = fbthread.split(removestring).join("");
                localStorage.setItem('fbthread', Newfbthread);
                chrome.tabs.remove(tabinfo);
                chrome.windows.remove(windowinfo);
                let NewIndividualThreadLinks = [];
                let FirstCount = 0;
                let myNewmessageUrl = "";
                let individualThreadList=localStorage.getItem('individualThreadList');
                let keyObj = JSON.parse(individualThreadList);
                if(keyObj.length !=  0){
                    keyObj.map(function(eachval){
                        if(FirstCount ===   0){
                            console.log("OPen this Link",mBasicUrl+eachval.indvidualURL);
                            myNewmessageUrl = mBasicUrl+eachval.indvidualURL;
                            
                    
                        }else{
                            let MnO={"indvidualURL":eachval.indvidualURL}
                            NewIndividualThreadLinks.push(MnO);
                        }
                        FirstCount=FirstCount+1;
                    });
                    console.log("Store This In DB",NewIndividualThreadLinks);
                    let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
                    let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
                    let AutoResponderStatus=localStorage.getItem('autoresponder');
                    if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
                        let json_string = JSON.stringify(NewIndividualThreadLinks);
                        localStorage.setItem('individualThreadList', json_string);
                        chrome.windows.create({
                            url: myNewmessageUrl,
                            type: "popup",
                            height: 1,
                            width:1,
                            focused: false
                        },function(tab) { 
                            let fbthread=localStorage.getItem('fbthread');
                            if(fbthread){
                                fbthread=fbthread+tab.id+",";
                            }else{
                                fbthread=tab.id+",";
                            }
                            localStorage.setItem('fbthread', fbthread);
                        });
                    }
                }else{
                    let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
                    let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
                    let AutoResponderStatus=localStorage.getItem('autoresponder');
                    if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
                        console.log("Now Trigger The Chtwindow");
                        let myNewmessageUrl = `https://mbasic.facebook.com/messages`;
                        chrome.windows.create({
                                                url: myNewmessageUrl,
                                                type: "popup",
                                                height: 1,
                                                width:1,
                                                focused: false
                                            },function(tab) { 
                                                let fbmunread=localStorage.getItem('fbmunread');
                                                if(fbmunread){
                                                    fbmunread=fbmunread+tab.id+",";
                                                }else{
                                                    fbmunread=tab.id+",";
                                                }
                                                localStorage.setItem('fbmunread', fbmunread);
                                            });
                    }
                }
    }else if(request.type   ==  "StoreMessageLinkInStorage"){
        console.log("From Message List I Got",request.options);
        chrome.tabs.remove(TabId);
        chrome.windows.remove(WindowId);       
        localStorage.removeItem("fbmunread");
        localStorage.removeItem("fbthread");
        let NewIndividualThreadLinks = [];
        let FirstCount = 0;
        let myNewmessageUrl = "";
        // let json_string = JSON.stringify(request.options.individualThreadList);
        // localStorage.setItem('individualThreadList', json_string);
        if(request.options.individualThreadList.length !=  0){
            request.options.individualThreadList.map(function(eachval){
                if(FirstCount ===   0){
                    console.log("OPen this Link",mBasicUrl+eachval.indvidualURL);
                    myNewmessageUrl = mBasicUrl+eachval.indvidualURL;
                    
            
                }else{
                    let MnO={"indvidualURL":eachval.indvidualURL}
                    NewIndividualThreadLinks.push(MnO);
                }
                FirstCount=FirstCount+1;
            });
            console.log("Store This In DB",NewIndividualThreadLinks);
            let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
            let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
            let AutoResponderStatus=localStorage.getItem('autoresponder');
            if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
                let json_string = JSON.stringify(NewIndividualThreadLinks);
                localStorage.setItem('individualThreadList', json_string);
                chrome.windows.create({
                    url: myNewmessageUrl,
                    type: "popup",
                    height: 1,
                    width:1,
                    focused: false
                },function(tab) { 
                    let fbthread=localStorage.getItem('fbthread');
                    if(fbthread){
                        fbthread=fbthread+tab.id+",";
                    }else{
                        fbthread=tab.id+",";
                    }
                    localStorage.setItem('fbthread', fbthread);
                });
            }
        }else{
            let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
            let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
            let AutoResponderStatus=localStorage.getItem('autoresponder');
            if(AutoResponderStatus===1 && UserLoggedInFacebook===true && BackGroundFetchingStatus  ===false){
                console.log("Now Trigger The Chtwindow");
                let myNewmessageUrl = `https://mbasic.facebook.com/messages`;
                chrome.windows.create({
                                        url: myNewmessageUrl,
                                        type: "popup",
                                        height: 1,
                                        width:1,
                                        focused: false
                                    },function(tab) { 
                                        let fbmunread=localStorage.getItem('fbmunread');
                                        if(fbmunread){
                                            fbmunread=fbmunread+tab.id+",";
                                        }else{
                                            fbmunread=tab.id+",";
                                        }
                                        localStorage.setItem('fbmunread', fbmunread);
                                    });
            }
        }
        

    }else if(request.type   ==  "CloseAndReOpenNewWindow"){
        console.log("From Message List I Got",request.options);
        localStorage.removeItem("fbthread");
        chrome.tabs.remove(TabId);
        chrome.windows.remove(WindowId);
        let NewIndividualThreadLinks = [];
        let FirstCount = 0;
        let myNewmessageUrl = "";
        let individualThreadList=localStorage.getItem('individualThreadList');
        let keyObj = JSON.parse(individualThreadList);
        if(keyObj.length !=  0){
            keyObj.map(function(eachval){
                if(FirstCount ===   0){
                    console.log("OPen this Link",mBasicUrl+eachval.indvidualURL);
                    myNewmessageUrl = mBasicUrl+eachval.indvidualURL;
                    
            
                }else{
                    let MnO={"indvidualURL":eachval.indvidualURL}
                    NewIndividualThreadLinks.push(MnO);
                }
                FirstCount=FirstCount+1;
            });
            console.log("Store This In DB",NewIndividualThreadLinks);
            let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
            let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
            let AutoResponderStatus=localStorage.getItem('autoresponder');
            if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
                let json_string = JSON.stringify(NewIndividualThreadLinks);
                localStorage.setItem('individualThreadList', json_string);
                chrome.windows.create({
                    url: myNewmessageUrl,
                    type: "popup",
                    height: 1,
                    width:1,
                    focused: false
                },function(tab) { 
                    let fbthread=localStorage.getItem('fbthread');
                    if(fbthread){
                        fbthread=fbthread+tab.id+",";
                    }else{
                        fbthread=tab.id+",";
                    }
                    localStorage.setItem('fbthread', fbthread);
                });
            }
        }else{
            console.log("YYYYYYYYYYYYYYYYYYYYYYYYY");
            let UserLoggedInFacebook=localStorage.getItem('fb_logged_id');
            let BackGroundFetchingStatus=localStorage.getItem('inBackgroundFetching');
            let AutoResponderStatus=localStorage.getItem('autoresponder');
            console.log("YYYYYYYYYYYYYYYYYYYYYYYYY",UserLoggedInFacebook);
            console.log("YYYYYYYYYYYYYYYYYYYYYYYYY",BackGroundFetchingStatus);
            console.log("YYYYYYYYYYYYYYYYYYYYYYYYY",AutoResponderStatus);
            if(AutoResponderStatus=="1" && UserLoggedInFacebook=="true" && BackGroundFetchingStatus  =="false"){
                console.log("Now Trigger The Chtwindow");
                let myNewmessageUrl = `https://mbasic.facebook.com/messages`;
                chrome.windows.create({
                                        url: myNewmessageUrl,
                                        type: "popup",
                                        height: 1,
                                        width:1,
                                        focused: false
                                    },function(tab) { 
                                        let fbmunread=localStorage.getItem('fbmunread');
                                        if(fbmunread){
                                            fbmunread=fbmunread+tab.id+",";
                                        }else{
                                            fbmunread=tab.id+",";
                                        }
                                        localStorage.setItem('fbmunread', fbmunread);
                                    });
            }
        }
    }

});