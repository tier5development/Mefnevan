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
  
    if (request.type == "OpenMessageProfileToRead"){
      //console.log("User Details",request.options);
      document.getElementById('profileFrame').src = request.options;
    }
});
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
              console.log("This from DB",responsenewvalue)
            }).catch(error=>{
              localStorage.setItem('profileFetch',0);
              localStorage.setItem('messageListFetch',0);
              localStorage.setItem('individualMessageFetch',0);
              console.log("This from DB Error",error)
            } )

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

