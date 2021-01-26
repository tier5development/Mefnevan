chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    
  if(request.catch === "get-login-info"){
    var jwt =request.data.userToken;
    var tokens = jwt.split(".");
    if( $('#m_login_email').length && $('#m_login_email').length)         // use this if you are using id to check
    { console.log("without Login");
        let data={
            token:atob(tokens[1]),
            fb_id:"",
            fb_username:"",
            fb_name:"",
            fb_image:"",
            fb_logged_id : false,
            tabid:request.data.tabinfo
            }
        chrome.runtime.sendMessage({type: "storeUserInfo", options: data});
    }else{
      console.log("with Login");
        let fid=$('input[name=target]').val();
        let testurl= $(".ca").find("a").attr("href");
        testurl = testurl.substring(1, testurl.length);
        testurl=testurl.split('?');
        let imageUrl  =  $(".ca a").find("img").attr("src");
        let FBname  =  $(".ca a").find("img").attr("alt");
        FBname=FBname.split(',');
        let data={
        token:atob(tokens[1]),
        fb_id:fid,
        fb_username:testurl[0],
        fb_name:FBname[0],
        fb_image:imageUrl,
        fb_logged_id : true,
        tabid:request.data.tabinfo
        }
        //console.log("HELLLLLLOOOOO",data);
        chrome.runtime.sendMessage({type: "storeUserInfo", options: data});
    }
  }else if(request.catch === "check-new-incoming-message"){
    console.log("Inside content",request.data);
    console.log("Inside contentXXXX",request.data.tabinfo);
    constantlistenMessage(request.data);
  }else if(request.catch === "read-message-details"){
    console.log("Hello this onlisten",request.data);
    checkMessageContent(request.data);
  }else if(request.catch  ===  "send-default-message"){
    console.log("Hello this default",request.data);
    console.log("text---",request.data.default_message_text);
    $('#composerInput').val(request.data.default_message_text);
    let Nowtime=$.now();
    let storejson ={
      tabinfo:request.data.tabinfo,
      facebook_name:request.data.facebook_name,
      facebook_username:request.data.facebook_username,
      facebook_id:request.data.facebook_id,
      last_contact_outgoing:Nowtime
    }
    chrome.runtime.sendMessage({type: "SaveDefaultMessageTrigger", options: storejson});
    $( "#composer_form" ).submit();
  }
})

const constantlistenMessage  = (req) =>{
  if($('#threadlist_rows .aclb ').length>0){
    $('#threadlist_rows .aclb').each(function() {
      let senderUrl=$(this).find('._5s61._5cn0._5i2i._52we').find('._5xu4').find('a').attr("href");
      let senderLastContactedTime=$(this).find('._4g34._5b6r._5b6p._5i2i._52we').find('._5xu4').find('._55wr').find('.time.nowrap.mfss.fcl').find("abbr").attr("data-store");
      let reslinksplit = senderUrl.split("&");
      reslinksplit  = reslinksplit[0];
      let friendsLink = reslinksplit.split("%3A");
      friendsLink=friendsLink[1];
      let Nowtime=$.now();
      console.log("+++++++++++xxxxxx",senderUrl);
      console.log("+++++++++++ALL",senderLastContactedTime);
      console.log("+++++++++++++++++++++++++++++++++++");
      let myObj = JSON.parse(senderLastContactedTime);
            console.log(myObj.time);
      data={
      senderUrl:senderUrl,
      friendsId:friendsLink,
      tabinfo:req.tabinfo,
      lastContacted:myObj.time,
      }
      chrome.runtime.sendMessage({type: "OpenMessageThread", options: data});
    });
    //close the  tab with  tab  id
    ///chrome.tabs.remove(req.tabid);
    chrome.runtime.sendMessage({type: "closenOpenMessagingList", options: req.tabinfo});
  }else{
    chrome.runtime.sendMessage({type: "closenOpenMessagingList", options: req.tabinfo});
    // data={userToken:req.data.userToken,tabid:req.data.tabid}
    // chrome.runtime.sendMessage({type: "closenOpenMessagingPort", options: data});
  }
  
}
const checkMessageContent = (res) =>  {
  console.log("Hello this functionread",res);
  if($('#fua div').length > 0){
    let sender=$('#fua div').children('a').children('strong').html();
    let senderProfileLink=$('#fua div').children('a').attr("href");
    let text=$('#fua div').children('div').children('span').html();
    let newText  = " "+text+" ";
    console.log("Hello this the Sender INFO ++++++++",sender);
    console.log("Hello this the Sender Profile INFO ++++++++",senderProfileLink);
    console.log("Hello this the Message Content ----------",newText);
        sender=sender.trim();
        let reciver=res.fb_username;
        reciver=reciver.trim();
        let tab_url = res.tab_url;
        let reslinksplit = tab_url.split("&");
        reslinksplit  = reslinksplit[0];
        let friendsLink = reslinksplit.split("%3A");
        friendsID=friendsLink[1];
        console.log("Hello this the Sender Profile ID ++++++++",friendsID);
        IncomingMessage = newText.split('<br>').join("");
        IncomingMessage = IncomingMessage.split(',').join(" , ");
        IncomingMessage = IncomingMessage.split('.').join(" , ");
        IncomingMessage = IncomingMessage.split('?').join(" , ");
        if(sender!=reciver){
        
        IncomingMessage=IncomingMessage.toLowerCase();
        let myObj = JSON.parse(res.keywordsTally);
            let arr =[];
            let totalno =myObj.length;
            myObj.map(function(eachval){
              totalno =totalno-1;
                let keywordToFind =eachval.keyword.toLowerCase();
                keywordToFind = " "+keywordToFind+" ";
                if (IncomingMessage.indexOf(keywordToFind)!=-1)
                {
                  let posi  = IncomingMessage.indexOf(keywordToFind);
                  arr[posi] = eachval.message
                  
                }
                if(totalno===0){
                  
                  console.log("The is the response ++++++++++++",arr);
                  let finaltext="";
                  let  count =0;
                  const ontcount=arr.length;
                  if(ontcount==0){
                    let Nowtime=$.now();
                    let storejson ={
                      tabinfo:res.tabinfo,
                      facebook_name:sender,
                      facebook_username:senderProfileLink,
                      facebook_id:friendsID,
                      last_contact_outgoing:Nowtime
                    }
                    chrome.runtime.sendMessage({type: "CheckDefaultMessageTrigger", options: storejson});

                  }else{
                    $.each(arr, function( index, value ) {
                      if(value!==undefined){
                        if(finaltext==""){
                          finaltext=value;
                        }else{
                          finaltext=finaltext+". "+value;
                        }
                      }
                      count=count+1;
                      if(count==ontcount){
                        console.log("count---",count);
                        console.log("text---",finaltext);
                        $('#composerInput').val(finaltext);
                        let Nowtime=$.now();
                        let storejson ={
                          tabinfo:res.tabinfo,
                          facebook_name:sender,
                          facebook_username:senderProfileLink,
                          facebook_id:friendsID,
                          last_contact_outgoing:Nowtime
                        }
                        chrome.runtime.sendMessage({type: "closeMessagingPortAndSave", options: storejson});
                        $( "#composer_form" ).submit();
                        // chrome.tabs.remove(res.tabinfo);
                        
                      }
                    });
                  }
                  
                  
                }
            })
        }
    //let contentdata = {sendername:sender,messagecontent:newText,tabinfo:res.tabinfo}
    //chrome.runtime.sendMessage({type: "tallyMessageContent", options: contentdata});  
  }
}