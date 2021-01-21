const getUserToken = () => localStorage.getItem("token");
console.log("I am background");
const method = { POST: "post", GET: "get", PUT: "put", DELETE: "delete" };
const toJsonStr = (val) => JSON.stringify(val);
const getApiUrl = 'https://apimfenevan.ngrok.io/';

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
                if (response.status !== 200 || !response.status) {
            
                } else {
                    let responsenewvalue = await response.json();
                    localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
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

    }
});
