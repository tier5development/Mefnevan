var div=document.createElement("div");
var textDiv =document.createElement("div");
var imgURL = chrome.extension.getURL('images/128X128.png');
div.style.width= "100%";
div.style.height= "100%";
div.style.position= "absolute";
div.style.zIndex = "10000";
div.style.background= "rgba(235,239,242,0.85)";
div.style.isplay= "flex";
div.style.flexWrap= "wrap";
div.style.alignContent= "center";
div.style.justifyContent= "center";
div.style.position = 'fixed';
div.style.top = '0';
div.style.left = '0';
var img = document.createElement("IMG");
img.src = imgURL;
img.style.position= "fixed";
img.style.top= "50%";
img.style.left= "50%";
img.style.transform= "translate(-50%, -50%)";
textDiv.innerHTML="MeFn Evan Is Using This Tab Please Don`t Close It";
textDiv.style.top= "70%";
textDiv.style.left= "27%";
textDiv.style.position = 'fixed';
textDiv.style.width= "100%";
textDiv.style.fontSize="41px";
textDiv.style.color= "#057ed9";
div.appendChild(img);
div.appendChild(textDiv);
document.body.appendChild(div); 

$(document).ready(function(){ 
    
    var target = document.querySelector('#threadlist_rows');
    var LocationDetails =window.location;
    
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            
            //console.log(mutation.target)
            
            $(mutation.target).find('.unreadMessage').each( async function() {
                //console.log("Yo  Yo");
                let senderDivDtails=$(this).html(); 
                console.log("This issss",senderDivDtails)
                let senderUrl=$(this).find('a').attr("href"); 
                console.log(senderUrl);
                if(senderUrl.includes("%3A")){
                    let port = chrome.runtime.connect({name: "ListKnock"});
                    port.postMessage({options: senderUrl,ConFlag:"StoreMessageLinkInLocalStorage"});
                    port.disconnect(); 
                }
                //chrome.runtime.sendMessage({type: "StoreMessageLinkInLocalStorage", options: senderUrl});
                
            });
            
        });
    });
    
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true }
    
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    
    });