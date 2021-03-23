/* eslint-disable no-undef */
const loginHelper = {
    
    login: function () {
        try{
            // const myNewUrl  =   `https://mbasic.facebook.com`;
            
            // let CreateWindow    = chrome.runtime.sendMessage({type: "OpenMessageProfileToRead", options: myNewUrl});
            //   return CreateWindow;
            const myNewUrl  =   `https://mbasic.facebook.com`;
            let CreateTab    =   chrome.tabs.create({
                url: myNewUrl,
                active: false,
                pinned:true
            },function(tab) { 
                let fbprofile=tab.id;
                localStorage.setItem('fbprofile', fbprofile);
            });
            console.log("This is a ",CreateTab);
            return CreateTab;
        }catch(error){
            return error
        }
        
        
    },
    logout: function () {
    try{
        const myNewUrl  =   `https://mbasic.facebook.com`;
        let CreateWindow    = chrome.runtime.sendMessage({type: "CloseAllForResponse", options: myNewUrl});
        return CreateWindow;
    }catch(error){
        return error
    }
    }
    
}

export default loginHelper