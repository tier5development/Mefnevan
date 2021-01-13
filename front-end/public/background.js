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
        console.log("I am background",tab.url);
        console.log("I am background",tab);
        if(tab.url === 'https://mbasic.facebook.com/'){
            console.log("I am Inside");
            let user=getUserToken();
            data={userToken:user}
            chrome.tabs.sendMessage(tab.id, { catch: "get-login-info",data });
        }
    }
});


chrome.runtime.onMessage.addListener(async function(request, sender) {
    if (request.type == "storeUserInfo"){
        console.log("I am Geting All Info",request.options);
        let user=getUserToken();
        let tokens = user.split(".");
        tokens =atob(tokens[1]);
        //console.log("This user1 info all",tokens);
        
        let myObj = JSON.parse(tokens);
        console.log("This user2 info all",myObj.user.id);
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
              responsenew = await response.json();
              console.log(responsenew.payload.facebook_id);
                localStorage.setItem('kyubi_user_token', responsenew.payload.kyubi_user_token);
                localStorage.setItem('fb_id', responsenew.payload.facebook_id);
                localStorage.setItem('fb_username', responsenew.payload.facebook_name);
                localStorage.setItem('fb_name', responsenew.payload.facebook_profile_name);
                localStorage.setItem('fb_image', responsenew.payload.facebook_image);
                localStorage.setItem('fb_logged_id', request.options.fb_logged_id);
                localStorage.setItem('inBackgroundFetching', false);
            }
        // if(response  && response.payload){
        //     // localStorage.setItem('user_rec', response.payload.kyubi_user_token);
        //     // localStorage.setItem('user_rec', response.payload.fb_id);
        //     // localStorage.setItem('user_rec', response.payload.fb_username);
        //     // localStorage.setItem('user_rec', response.payload.fb_name);
        //     // localStorage.setItem('user_rec', response.payload.fb_image);
        //     // localStorage.setItem('user_rec', response.payload.fb_logged_id);
            
        // }
        //console.log("This user3 info all",response.body.payload);

    }
});
