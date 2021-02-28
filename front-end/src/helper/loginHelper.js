/* eslint-disable no-undef */
const loginHelper = {
    
    login: function () {
        try{
            const myNewUrl  =   `https://m.facebook.com/messages`;
            // let CreateWindow    =   chrome.windows.create({
            //     url: myNewUrl,
            //     type: "popup",
            //     height: 500,
            //     width:500,
            //     left:window.screen.availWidth,
            //     top:window.screen.availHeight,
            //     focused: false
            //   },function(tab) { 
            //     console.log("this is the window",window.screen.availHeight);
            //     console.log("this is the window",window.screen.availWidth);
            //     let fbprofile=localStorage.getItem('fbprofile');
            //     if(fbprofile){
            //         fbprofile=fbprofile+tab.id+",";
            //     }else{
            //         fbprofile=tab.id+",";
            //     }
            //     localStorage.setItem('fbprofile', fbprofile);
            //      });
            let CreateWindow    = chrome.runtime.sendMessage({type: "OpenMessageProfileToRead", options: myNewUrl});
              return CreateWindow;
        }catch(error){
            return error
        }
        
        
    },
    framecaller: function () {
    try{
        //chrome.runtime.sendMessage({type: "CreateFrameWindow"});
        return "abc";
    }catch(error){
        return error
    }
    }
    
}

export default loginHelper