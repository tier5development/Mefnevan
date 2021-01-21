/* eslint-disable no-undef */
const loginHelper = {
    login: function () {
        try{
            const myNewUrl  =   `https://mbasic.facebook.com`;
            let CreateWindow    =   chrome.windows.create({
                url: myNewUrl,
                type: "popup",
                height: 200,
                focused: false
              });
              return CreateWindow;
        }catch(error){
            return error
        }
        
        
    }
    
}

export default loginHelper