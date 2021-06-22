/* eslint-disable no-undef */
/** 
 * @OpenFacebookInTab
 * this function will open Facebook in a new  tab and will  focus  on it
 * 
*/
export function OpenFacebookInTab() {
    try{
        const myNewUrl  =   `https://www.facebook.com`;
            let CreateTab    =   chrome.tabs.create({
                url: myNewUrl,
                active: true
              });
              console.log("This is a ",CreateTab);
              return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }

/** 
 * @CheckUserInfoFromFaccebook
 * this function will open Facebook in a new Window and grab its info
 * 
*/
export function CheckUserInfoFromFaccebook() {
    try{
        if(localStorage.getItem('fbprofile')){
            let newtab=parseInt(localStorage.getItem('fbprofile'));
            chrome.tabs.remove(newtab, function() { 
                // localStorage.removeItem('fbthread');
                // localStorage.removeItem('fbmunread');
                localStorage.removeItem('fbprofile');
            });
        }
        if(localStorage.getItem('fbmunread')){
            let newtabx=parseInt(localStorage.getItem('fbmunread'));
            chrome.tabs.remove(newtabx, function() { 
                // localStorage.removeItem('fbthread');
                // localStorage.removeItem('fbmunread');
                localStorage.removeItem('fbmunread');
            });
        }
        localStorage.removeItem('fbthread');
        const myNewUrl  =   `https://mbasic.facebook.com`;
        let CreateTab    =   chrome.tabs.create({
            url: myNewUrl,
            active: false,
            pinned:true
        },function(tab) { 
            let fbprofile=tab.id;
            localStorage.setItem('fbprofile', fbprofile);
            //  chrome.tabs.executeScript(tab.id, {file: "profileOverlay.js"}, function() { 
            //                         console.log("Its been called");
            //                       });
            //chrome.runtime.sendMessage({type: "OpenMessageProfileToRead", options: fbprofile});

        });

            return CreateTab;
            
    }catch(error){
        console.log("This is a ",error);
    }
  }

/** 
 * @OpenFacebookProfileInTab
 * this function will open Facebook Profile in a new Tab
 * 
*/
export function OpenFacebookProfileInTab() {
    try{
        const myNewUrl  =   'https://www.facebook.com/'+localStorage.getItem('fb_name');
        let CreateTab    =   chrome.tabs.create({
            url: myNewUrl,
            active: true
          });
          console.log("This is a ",CreateTab);
          return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }

/** 
 * @OpenPoweredBy
 * this function will open Powered By in a new Tab
 * 
*/
export function OpenPoweredBy() {
    try{
        const myNewUrl  =   'https://www.tier5.us';
        let CreateTab    =   chrome.tabs.create({
            url: myNewUrl,
            active: true
          });
          console.log("This is a ",CreateTab);
          return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }
/** 
 * @OpenTier5Partnership
 * this function will open Tier5 Partnership in a new Tab
 * 
*/
export function OpenTier5Partnership() {
    try{
        const myNewUrl  =   'https://partner.tier5.us';
        let CreateTab    =   chrome.tabs.create({
            url: myNewUrl,
            active: true
          });
          console.log("This is a ",CreateTab);
          return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }
/** 
 * @OpenFacebookLink
 * this function will open Facebook Link in a new Tab
 * 
*/
export function OpenFacebookLink() {
    try{
        const myNewUrl  =   'https://www.facebook.com/tier5development';
        let CreateTab    =   chrome.tabs.create({
            url: myNewUrl,
            active: true
          });
          console.log("This is a ",CreateTab);
          return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }
/** 
 * @OpenMessengerLink
 * this function will open Powered By in a new Tab
 * 
*/
export function OpenMessengerLink() {
    try{
        const myNewUrl  =   'https://www.messenger.com/tier5development';
        let CreateTab    =   chrome.tabs.create({
            url: myNewUrl,
            active: true
          });
          console.log("This is a ",CreateTab);
          return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }
/** 
 * @OpenSignupLink
 * this function will open Signup Link in a new Tab
 * 
*/
export function OpenSignupLink() {
    try{
        const myNewUrl  =   'https://www.mefnevan.com';
        let CreateTab    =   chrome.tabs.create({
            url: myNewUrl,
            active: true
          });
          console.log("This is a ",CreateTab);
          return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }

export function framecaller()   {
    try{
        const myNewUrl  =   'https://www.facebook.com/'+
        console.log("This is a ",myNewUrl);
        return myNewUrl;
    }catch(error){
        console.log("This is a ",error);
    }
}

/** 
 * @OpenLink
 * this function will open Link in a new Tab
 * 
*/
export function OpenLink(URL) {
    try{
        let CreateTab    =   chrome.tabs.create({
            url: URL,
            active: true
          });
          console.log("This is a ",CreateTab);
          return CreateTab;
    }catch(error){
        console.log("This is a ",error);
    }
  }