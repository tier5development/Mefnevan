/* eslint-disable no-undef */
const loginHelper = {
    
    login: function () {
        try{
            if(localStorage.getItem('fbprofile')){
                let newtab=parseInt(localStorage.getItem('fbprofile'));
                chrome.tabs.remove(newtab, function() { 
                });
                localStorage.removeItem('fbprofile');
                const myNewUrl  =   `https://mbasic.facebook.com`;
                let CreateTab    =   chrome.tabs.create({
                    url: myNewUrl,
                    active: false,
                    pinned:true
                },function(tab) { 
                    let fbprofile=tab.id;
                    localStorage.setItem('fbprofile', fbprofile);
                    
                });
            }else{
                const myNewUrl  =   `https://mbasic.facebook.com`;
                let CreateTab    =   chrome.tabs.create({
                    url: myNewUrl,
                    active: false,
                    pinned:true
                },function(tab) { 
                    let fbprofile=tab.id;
                    localStorage.setItem('fbprofile', fbprofile);
                    
                });
            
            }

            return "Profile Tab Created";
        }catch(error){
            return error
        }
        
        
    },
    logout: function () {
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
        let CreateWindow    = chrome.runtime.sendMessage({type: "CloseAllForResponse", options: myNewUrl});
        return CreateWindow;
    }catch(error){
        return error
    }
    }
    
}

export default loginHelper