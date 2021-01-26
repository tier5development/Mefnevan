const getUserToken = () => localStorage.getItem("token");
console.log("I am background");
const method = { POST: "post", GET: "get", PUT: "put", DELETE: "delete" };
const toJsonStr = (val) => JSON.stringify(val);
const getApiUrl = 'https://apimfenevan.ngrok.io/';
const mBasicUrl = 'https://mbasic.facebook.com';
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

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        if(tab.url === 'https://mbasic.facebook.com/'){
            console.log("I am Inside");
            let user=getUserToken();
            data={userToken:user,tabinfo:tab.id}
            chrome.tabs.sendMessage(tab.id, { catch: "get-login-info",data });
        }else  if(tab.url === 'https://m.facebook.com/messages'){
            data={tabinfo:tab.id}
            chrome.tabs.sendMessage(tab.id, { catch: "check-new-incoming-message",data });
        }else if(tab.url.includes('https://mbasic.facebook.com/messages/read/?tid=cid')){
            let fb_username=localStorage.getItem('fb_username');
            let fb_logged_id=localStorage.getItem('fb_logged_id');
            let default_message=localStorage.getItem('default_message');
            let default_message_text=localStorage.getItem('default_message_text');
            let autoresponder=localStorage.getItem('autoresponder');
            let default_time_delay=localStorage.getItem('default_time_delay');
            let keywordsTally=localStorage.getItem('keywordsTally'); 
            data={
                tabinfo             :   tab.id,
                fb_username         :   fb_username,
                fb_logged_id        :   fb_logged_id,
                default_message     :   default_message,
                default_message_text:   default_message_text,
                autoresponder       :   autoresponder,
                default_time_delay  :   default_time_delay,
                keywordsTally       :   keywordsTally,
                tab_url             :   tab.url
            }
            console.log("this are the URL",data);
            chrome.tabs.sendMessage(tab.id, { catch: "read-message-details",data });
        }
    }
});


chrome.runtime.onMessage.addListener(async function(request, sender) {
    if (request.type == "storeUserInfo"){
        let user=getUserToken();
        let tokens = user.split(".");
        tokens =atob(tokens[1]);
            let myObj = JSON.parse(tokens);
            if(request.options.fb_logged_id===true){
                let  params ={
                    user_rec:myObj.user.id,
                    fb_id: request.options.fb_id,
                    fb_username: request.options.fb_username,
                    fb_name: request.options.fb_name,
                    fb_image: request.options.fb_image,
                    fb_logged_id: request.options.fb_logged_id
                }
                let response = await handleRequest(
                    "api/user/userfacebook",
                    method.POST,
                    toJsonStr(params)
                    );
                    console.log("This are thhe  response",response);
                if (response.status !== 200 || !response.status) {
            
                } else {
                    let responsenewvalue = await response.json();
                    localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                    localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                    localStorage.setItem('fb_id', responsenewvalue.payload.UserInfo.facebook_id);
                    localStorage.setItem('fb_username', responsenewvalue.payload.UserInfo.facebook_name);
                    localStorage.setItem('fb_name', responsenewvalue.payload.UserInfo.facebook_profile_name);
                    localStorage.setItem('fb_image', responsenewvalue.payload.UserInfo.facebook_image);
                    localStorage.setItem('fb_logged_id', request.options.fb_logged_id);
                    localStorage.setItem('inBackgroundFetching', false);
                    localStorage.setItem('default_message', responsenewvalue.payload.UserSettings.default_message);
                    localStorage.setItem('default_message_text', responsenewvalue.payload.UserSettings.default_message_text);
                    localStorage.setItem('autoresponder', responsenewvalue.payload.UserSettings.autoresponder);
                    localStorage.setItem('default_time_delay', responsenewvalue.payload.UserSettings.default_time_delay);
                    localStorage.setItem('keywordsTally', JSON.stringify(responsenewvalue.payload.AutoResponderKeywords));
                }
            }else{
                let  params ={
                    user_rec:myObj.user.id,
                    
                }
                let response = await handleRequest(
                    "api/user/getUserDetails",
                    method.POST,
                    toJsonStr(params)
                    );
                let responsenewvalue = await response.json();
                    localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                    localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                    localStorage.setItem('fb_id', responsenewvalue.payload.UserInfo.facebook_id);
                    localStorage.setItem('fb_username', responsenewvalue.payload.UserInfo.facebook_name);
                    localStorage.setItem('fb_name', responsenewvalue.payload.UserInfo.facebook_profile_name);
                    localStorage.setItem('fb_image', responsenewvalue.payload.UserInfo.facebook_image);
                    localStorage.setItem('fb_logged_id', request.options.fb_logged_id);
                    localStorage.setItem('inBackgroundFetching', false);
                    localStorage.setItem('default_message', responsenewvalue.payload.UserSettings.default_message);
                    localStorage.setItem('default_message_text', responsenewvalue.payload.UserSettings.default_message_text);
                    localStorage.setItem('autoresponder', responsenewvalue.payload.UserSettings.autoresponder);
                    localStorage.setItem('default_time_delay', responsenewvalue.payload.UserSettings.default_time_delay);
                    localStorage.setItem('keywordsTally', JSON.stringify(responsenewvalue.payload.AutoResponderKeywords));    
            }
            chrome.tabs.remove(request.options.tabid);

            let isAutoresponderset=localStorage.getItem('autoresponder');
            let isUserLoggedInFacebook=localStorage.getItem('fb_logged_id');
            let inBackgroundFetching = localStorage.getItem('inBackgroundFetching');
            
            if(isAutoresponderset==="1" && isUserLoggedInFacebook==="true" && inBackgroundFetching  ==="false"){
                let myNewmessageUrl = `https://m.facebook.com/messages`;
                chrome.windows.create({
                    url: myNewmessageUrl,
                    type: "popup",
                    height: 1,
                    width:1,
                    focused: false
                  });
            }

            

    }else if(request.type === "OpenMessageThread"){
        console.log("This are the parama i ama reciving",request.options);
        let friendsuser=localStorage.getItem('user_id');
        let  params ={
            user_id:friendsuser,
            facebook_id:parseInt(request.options.friendsId),
            last_contact_incoming:parseInt(request.options.lastContacted)            
        }
        let response = await handleRequest(
            "api/friend/friendsCreateOrUpdate",
            method.POST,
            toJsonStr(params)
            );
        
        if(request.options.senderUrl !==""){
            let myNewMessageIndividualUrl = mBasicUrl+request.options.senderUrl;
                chrome.windows.create({
                    url: myNewMessageIndividualUrl,
                    type: "popup",
                    height: 1,
                    width:1,
                    focused: false
                  });
        }
    }else if(request.type   === "tallyMessageContent"){
        
        if(request.options.sendername !== fb_username && autoresponder ===  "1"){
            console.log(request.options.messagecontent);
            let myObj = JSON.parse(keywordsTally);
            console.log(myObj);
            myObj.map(function(eachval){
                console.log(eachval);
            })
        }
    }else if(request.type   === "closeMessagingPortAndSave"){
        console.log("This are the parama i ama reciving",request.options);
        let friendsuser=localStorage.getItem('user_id');
        let  params ={
            user_id:friendsuser,
            facebook_id:parseInt(request.options.facebook_id),
            last_contact_outgoing:parseInt(request.options.last_contact_outgoing),
            facebook_username:request.options.facebook_username,
            facebook_name:request.options.facebook_name           
        }
        let response = await handleRequest(
            "api/friend/friendsUpdate",
            method.POST,
            toJsonStr(params)
            );
        console.log("YOOOOOOOOOOOOOOOOOOOO",params);
        chrome.tabs.remove(request.options.tabinfo);
    }else if(request.type   === "CheckDefaultMessageTrigger"){
        console.log("This are the parama i ama reciving",request.options);
        let friendsuser=localStorage.getItem('user_id');
        let default_message=localStorage.getItem('default_message');
        let default_message_text=localStorage.getItem('default_message_text');
        let autoresponder=localStorage.getItem('autoresponder');
        let default_time_delay=localStorage.getItem('default_time_delay');
        let  params ={
            user_id:friendsuser,
            facebook_id:parseInt(request.options.facebook_id),
            last_contact_outgoing:parseInt(request.options.last_contact_outgoing),
            facebook_username:request.options.facebook_username,
            facebook_name:request.options.facebook_name,
            default_time_delay:parseInt(default_time_delay),
            default_message_text:default_message_text,
            tabinfo:request.options.tabinfo           
        }
        if(default_message ===  "1"){
            let response = await handleRequest(
                "api/friend/friendsDefaultMessageCheck",
                method.POST,
                toJsonStr(params)
                );
                console.log("this is the response",response);
                let responsenewvalue = await response.json();
                console.log("this is the response",responsenewvalue);
                if(responsenewvalue.code==1){
                    let  data ={
                        user_id:friendsuser,
                        facebook_id:parseInt(request.options.facebook_id),
                        last_contact_outgoing:parseInt(request.options.last_contact_outgoing),
                        facebook_username:request.options.facebook_username,
                        facebook_name:request.options.facebook_name,
                        default_time_delay:parseInt(default_time_delay),
                        default_message_text:default_message_text,
                        tabinfo:request.options.tabinfo           
                    }
                    chrome.tabs.sendMessage(request.options.tabinfo, { catch: "send-default-message",data });
                }else{
                    chrome.tabs.remove(request.options.tabinfo);
                }
        }
    }else if(request.type   === "SaveDefaultMessageTrigger"){
        console.log("This are the parama i ama reciving",request.options);
        let friendsuser=localStorage.getItem('user_id');
        let  params ={
            user_id:friendsuser,
            facebook_id:parseInt(request.options.facebook_id),
            last_contact_outgoing:parseInt(request.options.last_contact_outgoing),
            facebook_username:request.options.facebook_username,
            facebook_name:request.options.facebook_name           
        }
        let response = await handleRequest(
            "api/friend/friendsUpdateDefaut",
            method.POST,
            toJsonStr(params)
            );
        chrome.tabs.remove(request.options.tabinfo);
    }else if(request.type    === "closenOpenMessagingList"){
        chrome.tabs.remove(request.options);
        let isAutoresponderset=localStorage.getItem('autoresponder');
            let isUserLoggedInFacebook=localStorage.getItem('fb_logged_id');
            let inBackgroundFetching = localStorage.getItem('inBackgroundFetching');
            console.log(isAutoresponderset);
            console.log(isUserLoggedInFacebook);
            if(isAutoresponderset==="1" && isUserLoggedInFacebook==="true" && inBackgroundFetching  ==="false"){
                setTimeout(() => {
                    let myNewmessageUrl = `https://m.facebook.com/messages`;
                    chrome.windows.create({
                        url: myNewmessageUrl,
                        type: "popup",
                        height: 1,
                        width:1,
                        focused: false
                      });
                    
                }, 3000);
                
                
            }
    }
});
