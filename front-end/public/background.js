//console.log("I am background ");
//console.log("I am background 1234",screen.width);
//console.log("I am background 1234",screen.height);
const getApiUrl = "https://apimfenevan.ngrok.io/"; //"https://api.mefnevan.com" ;
const MessageListUrl = `https://mbasic.facebook.com/messages`;
const mBasicUrl = 'https://mbasic.facebook.com';
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
 * this will listen to the  on runtime Message
 * 
*/
chrome.runtime.onMessage.addListener(async function(request, sender) {
    if (request.type == "storeUserInfoOrQueryThenStore"){
        console.log("This I Got In Background",request.options);
        let  params ={
        user_rec    :   localStorage.getItem('kyubi_user_token'),
        fb_id   :   request.options.FacebookId,
        fb_username :   request.options.FacebookUsername,
        fb_name :   request.options.FacebookName,
        fb_image    :  request.options.FacebookImage,
        fb_logged_id    :   request.options.LoggedInFacebook
        };
        await handleRequest(
            "api/user/userCheckStoreNRetrive",
            method.POST,
            toJsonStr(params)
            ).then(async response =>  {
              let responsenewvalue = await response.json();
                      console.log("This from DB",responsenewvalue);
                      localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                      localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                      localStorage.setItem('fb_id', responsenewvalue.payload.UserInfo.facebook_fbid);
                      localStorage.setItem('fb_username', responsenewvalue.payload.UserInfo.facebook_name);
                      localStorage.setItem('fb_name', responsenewvalue.payload.UserInfo.facebook_profile_name);
                      localStorage.setItem('fb_image', responsenewvalue.payload.UserInfo.facebook_image);
                      localStorage.setItem('fb_logged_id', request.options.LoggedInFacebook);
                      localStorage.setItem('inBackgroundFetching', false);
                      localStorage.setItem('profileFetch',0);
                      localStorage.setItem('messageListFetch',0);
                      localStorage.setItem('individualMessageFetch',0);
                      UserLoggedInFacebook=request.options.LoggedInFacebook;
                      BackGroundFetchingStatus  =false;
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
            }).catch(error=>{
              localStorage.setItem('profileFetch',0);
              localStorage.setItem('messageListFetch',0);
              localStorage.setItem('individualMessageFetch',0);
              
            } )

    }
    if (request.type == "OpenMessageProfileToRead"){
      //console.log("User Details",request.options);
      document.getElementById('profileFrame').src = request.options;
    }

})

chrome.webRequest.onHeadersReceived.addListener(
    function (info) {
      var headers = info.responseHeaders;
      var index = headers.findIndex(x =>
        x.name.toLowerCase() == "x-frame-options");
      if (index != -1) {
        headers.splice(index, 1);
      }
      return { responseHeaders: headers };
    },
    {
      urls: ['*://*.facebook.com/*','*://m.facebook.com/*'], //
      types: ['sub_frame']
    },
    ['blocking', 'responseHeaders']
  );

