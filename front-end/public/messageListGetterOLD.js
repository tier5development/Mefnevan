//console.log("I am in MessageList JS ");
let kyubi_user_token=localStorage.getItem('kyubi_user_token');
//console.log("Check Check Check ",kyubi_user_token);
let IndividualMessageList = [];
if($('#objects_container #root').find('div').find('section').find('table').length  > 0){
    $('#objects_container #root').find('div').find('section').find('table').each( async function() {
      if($(this).find('tbody').find('tr').find('td').find('header').length  !=  0){
        let senderUrl=$(this).find('tbody').find('tr').find('td').find('header').find('h3').find('a').attr("href"); 
        let MnO={"indvidualURL":senderUrl}
        IndividualMessageList.push(MnO);
      }
    });
    //console.log("Check",IndividualMessageList);
    let parameters={          
      individualThreadList  : IndividualMessageList
    }
    //console.log("Window Links are",IndividualMessageList);
    chrome.runtime.sendMessage({type: "StoreMessageLinkInStorage", options: parameters});
    //chrome.runtime.sendMessage({type: "OpenIndividualMessageThenCloseAndReopenMessageList", options: parameters});
  }