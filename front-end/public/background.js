const getApiUrl="https://api.mefnevan.com/",MessageListUrl="https://mbasic.facebook.com/messages",mBasicUrl="https://mbasic.facebook.com",method={POST:"post",GET:"get",PUT:"put",DELETE:"delete"},toJsonStr=e=>JSON.stringify(e),handleRequest=(e,t,a)=>{return fetch(getApiUrl+e,{method:t,headers:{Accept:"application/json","Content-Type":"application/json","Access-Control-Allow-Origin":!0},body:a})};chrome.runtime.onMessage.addListener(async function(e,t){"OpenMessageProfileToRead"==e.type&&(document.getElementById("friendReq").src=e.options)}),chrome.runtime.onMessage.addListener(async function(e,t){if("storeUserInfoOrQueryThenStore"==e.type){let t=0,a=0,o=!1,s=!0;if(!0===e.options.fb_logged_id){let l={user_rec:localStorage.getItem("kyubi_user_token"),fb_id:e.options.fb_id,fb_username:e.options.fb_username,fb_name:e.options.fb_name,fb_image:e.options.fb_image,fb_logged_id:e.options.fb_logged_id};await handleRequest("api/user/userfacebook",method.POST,toJsonStr(l)).then(async l=>{let i=await l.json();localStorage.setItem("kyubi_user_token",i.payload.UserInfo.kyubi_user_token),localStorage.setItem("user_id",i.payload.UserInfo.user_id),localStorage.setItem("fb_id",i.payload.UserInfo.facebook_id),localStorage.setItem("fb_username",i.payload.UserInfo.facebook_name),localStorage.setItem("fb_name",i.payload.UserInfo.facebook_profile_name),localStorage.setItem("fb_image",i.payload.UserInfo.facebook_image),localStorage.setItem("fb_logged_id",e.options.fb_logged_id),localStorage.setItem("inBackgroundFetching",!1),localStorage.setItem("profileFetch",1),localStorage.setItem("messageListFetch",0),localStorage.setItem("individualMessageFetch",0),o=e.options.fb_logged_id,s=!1,i.payload.UserSettings.default_message?(localStorage.setItem("default_message",i.payload.UserSettings.default_message),a=i.payload.UserSettings.default_message):localStorage.setItem("default_message",0),i.payload.UserSettings.default_message_text&&localStorage.setItem("default_message_text",i.payload.UserSettings.default_message_text),i.payload.UserSettings.autoresponder?(localStorage.setItem("autoresponder",i.payload.UserSettings.autoresponder),t=i.payload.UserSettings.autoresponder):localStorage.setItem("autoresponder",0),i.payload.UserSettings.default_time_delay&&localStorage.setItem("default_time_delay",i.payload.UserSettings.default_time_delay)}).catch(e=>{localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",0),localStorage.setItem("individualMessageFetch",0)})}else{let l={user_rec:localStorage.getItem("kyubi_user_token")};await handleRequest("api/user/getUserDetails",method.POST,toJsonStr(l)).then(async l=>{let i=await l.json();localStorage.setItem("kyubi_user_token",i.payload.UserInfo.kyubi_user_token),localStorage.setItem("user_id",i.payload.UserInfo.user_id),localStorage.setItem("fb_id",i.payload.UserInfo.facebook_id),localStorage.setItem("fb_username",i.payload.UserInfo.facebook_name),localStorage.setItem("fb_name",i.payload.UserInfo.facebook_profile_name),localStorage.setItem("fb_image",i.payload.UserInfo.facebook_image),localStorage.setItem("fb_logged_id",e.options.fb_logged_id),localStorage.setItem("inBackgroundFetching",!1),localStorage.setItem("profileFetch",1),localStorage.setItem("messageListFetch",0),localStorage.setItem("individualMessageFetch",0),o=e.options.fb_logged_id,s=!1,i.payload.UserSettings.default_message?(localStorage.setItem("default_message",i.payload.UserSettings.default_message),a=i.payload.UserSettings.default_message):localStorage.setItem("default_message",0),i.payload.UserSettings.default_message_text&&localStorage.setItem("default_message_text",i.payload.UserSettings.default_message_text),i.payload.UserSettings.autoresponder?(localStorage.setItem("autoresponder",i.payload.UserSettings.autoresponder),t=i.payload.UserSettings.autoresponder):localStorage.setItem("autoresponder",0),i.payload.UserSettings.default_time_delay&&localStorage.setItem("default_time_delay",i.payload.UserSettings.default_time_delay),localStorage.setItem("keywordsTally",JSON.stringify(i.payload.AutoResponderKeywords))}).catch(e=>{localStorage.setItem("profileFetch",1),localStorage.setItem("messageListFetch",0),localStorage.setItem("individualMessageFetch",0)})}document.getElementById("friendReq").src="";let l=localStorage.getItem("profileFetch");1!==t&&1!==a||!0!==o||!1!==s||"1"!==l?(document.getElementById("friendReq").src="",localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",0),localStorage.setItem("individualMessageFetch",0)):(document.getElementById("friendReq").src=MessageListUrl,localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",1),localStorage.setItem("individualMessageFetch",0))}if("StoreMessageLinkInStorage"==e.type)if(0!=e.options.individualThreadList.length){let t=0,a=0,o=!1,s=!0,l=localStorage.getItem("messageListFetch");if(localStorage.getItem("default_message")&&(a=localStorage.getItem("default_message")),localStorage.getItem("autoresponder")&&(t=localStorage.getItem("autoresponder")),o=localStorage.getItem("fb_logged_id"),s=localStorage.getItem("inBackgroundFetching"),("1"==t||"1"==a)&&"true"==o&&"false"==s&&"1"===l){document.getElementById("friendReq").src="";let a="",o=[],s=0;e.options.individualThreadList.map(function(e){if(0===s)a=mBasicUrl+e.indvidualURL;else{let t={indvidualURL:e.indvidualURL};o.push(t)}s+=1});let l=JSON.stringify(o);localStorage.setItem("individualThreadList",l),document.getElementById("friendReq").src=a;let i=localStorage.getItem("kyubi_user_token"),r=document.getElementById("friendReq");r.setAttribute("data-token",i),r.setAttribute("data-autostatus",t),localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",0),localStorage.setItem("individualMessageFetch",1)}}else document.getElementById("friendReq").src=MessageListUrl,localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",1),localStorage.setItem("individualMessageFetch",0)}),chrome.runtime.onConnect.addListener(function(e){let t=localStorage.getItem("fb_username"),a=localStorage.getItem("fb_logged_id"),o=localStorage.getItem("default_message"),s=localStorage.getItem("default_message_text"),l=localStorage.getItem("autoresponder"),i=localStorage.getItem("default_time_delay"),r=localStorage.getItem("keywordsTally"),d=localStorage.getItem("user_id"),n=localStorage.getItem("fb_id");localStorage.getItem("profileFetch"),localStorage.getItem("messageListFetch"),localStorage.getItem("individualMessageFetch");e.onMessage.addListener(async function(g){if("INDVAL"==g.ConFlag){let c="";c=g.UserAndFriendId[0].trim()==n?g.UserAndFriendId[1].trim():g.UserAndFriendId[0].trim(),data={FacebookUserId:n,FaceBookUsername:t,IsFaceBookLoggedIn:a,DefaultMessageState:o,DefaultMessageTexting:s,AutoresponderStatus:l,DefaultMessageTimeDelay:i,AutoResponderKeyword:r,MfenevanId:d,FacebooKFriendId:c},e.postMessage({userInfoDetails:data,ConFlagBack:"INDVALBACK"})}if("UDATEIFRAMEURLONLY"==g.ConFlag){let e=localStorage.getItem("autoresponder"),t=localStorage.getItem("default_message"),a=localStorage.getItem("fb_logged_id"),o=localStorage.getItem("inBackgroundFetching"),s=localStorage.getItem("individualMessageFetch"),l=JSON.parse(localStorage.getItem("individualThreadList"));if("1"!=e&&"1"!=t||"true"!=a||"false"!=o||"1"!==s)localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",0),localStorage.setItem("individualMessageFetch",0);else if(0!=l.length){document.getElementById("friendReq").src="";let e="",t=[],a=0;l.map(function(o){if(0===a)e=mBasicUrl+o.indvidualURL;else{let e={indvidualURL:o.indvidualURL};t.push(e)}a+=1});let o=JSON.stringify(t);localStorage.setItem("individualThreadList",o),document.getElementById("friendReq").src=e}else document.getElementById("friendReq").src="",document.getElementById("friendReq").src=MessageListUrl,localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",1),localStorage.setItem("individualMessageFetch",0)}if("CHECKELIGABLEFORDEFAULTMESSAGE"==g.ConFlag){localStorage.getItem("autoresponder"),localStorage.getItem("default_message"),localStorage.getItem("fb_logged_id"),localStorage.getItem("inBackgroundFetching"),localStorage.getItem("individualMessageFetch");let t=JSON.parse(localStorage.getItem("individualThreadList")),a=localStorage.getItem("user_id");localStorage.getItem("profileFetch"),localStorage.getItem("messageListFetch");if("1"==localStorage.getItem("individualMessageFetch")){let o={MfenevanId:a,FacebookUserId:g.payload.FacebookUserId,FriendFacebookId:g.payload.FacebooKFriendId,FacebookFirstName:g.payload.FriendFirstName,FacebookLastName:g.payload.FriendLastName,ProfileLink:g.payload.FriendProfileLink,TimeNow:parseInt(g.payload.ResponseTime)},s=await handleRequest("api/friend/checkFriendReadyToReciveDefaultMessage",method.POST,toJsonStr(o)),l=await s.json();if(1==l.code)if(1==l.payload.stateCode)data={MfenevanId:a,FacebookUserId:g.payload.FacebookUserId,FriendFacebookId:g.payload.FacebooKFriendId,FacebookFirstName:g.payload.FriendFirstName,FacebookLastName:g.payload.FriendLastName,ProfileLink:g.payload.FriendProfileLink,ResponseMessage:l.payload.ResponseMessage},e.postMessage({userInfoDetails:data,ConFlagBack:"INDVALBACKDEFAULT"});else if(0!=t.length){document.getElementById("friendReq").src="";let e="",a=[],o=0;t.map(function(t){if(0===o)e=mBasicUrl+t.indvidualURL;else{let e={indvidualURL:t.indvidualURL};a.push(e)}o+=1});let s=JSON.stringify(a);localStorage.setItem("individualThreadList",s),document.getElementById("friendReq").src=e}else document.getElementById("friendReq").src="",document.getElementById("friendReq").src=MessageListUrl,localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",1),localStorage.setItem("individualMessageFetch",0);else if(0!=t.length){document.getElementById("friendReq").src="";let e="",a=[],o=0;t.map(function(t){if(0===o)e=mBasicUrl+t.indvidualURL;else{let e={indvidualURL:t.indvidualURL};a.push(e)}o+=1});let s=JSON.stringify(a);localStorage.setItem("individualThreadList",s),document.getElementById("friendReq").src=e}else document.getElementById("friendReq").src="",document.getElementById("friendReq").src=MessageListUrl,localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",1),localStorage.setItem("individualMessageFetch",0)}}if("STORESENDDETAILS"==g.ConFlag){let e={FacebookFirstName:g.payload.FacebookFirstName,FacebookLastName:g.payload.FacebookLastName,FacebookUserId:g.payload.FacebookUserId,FriendFacebookId:g.payload.FriendFacebookId,MessageSenderType:g.payload.MessageSenderType,MfenevanId:g.payload.MfenevanId,ProfileLink:g.payload.ProfileLink,ResponseMessage:g.payload.ResponseMessage,ResponseTime:g.payload.ResponseTime},t=await handleRequest("api/friend/saveLastMessageOutForFriend",method.POST,toJsonStr(e));(await t.json()).code;let a=JSON.parse(localStorage.getItem("individualThreadList"));if(0!=a.length){document.getElementById("friendReq").src="";let e="",t=[],o=0;a.map(function(a){if(0===o)e=mBasicUrl+a.indvidualURL;else{let e={indvidualURL:a.indvidualURL};t.push(e)}o+=1});let s=JSON.stringify(t);localStorage.setItem("individualThreadList",s),document.getElementById("friendReq").src=e}else document.getElementById("friendReq").src="",document.getElementById("friendReq").src=MessageListUrl,localStorage.setItem("profileFetch",0),localStorage.setItem("messageListFetch",1),localStorage.setItem("individualMessageFetch",0)}})}),chrome.webRequest.onHeadersReceived.addListener(function(e){var t=e.responseHeaders,a=t.findIndex(e=>"x-frame-options"==e.name.toLowerCase());return-1!=a&&t.splice(a,1),{responseHeaders:t}},{urls:["*://*.facebook.com/*","*://m.facebook.com/*"],types:["sub_frame"]},["blocking","responseHeaders"]);