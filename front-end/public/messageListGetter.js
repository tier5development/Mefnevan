
// console.log("I am in Message JS ");

// // $('#threadlist_rows').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
// //  console.log("Ennnnnnn");
// //  console.log("Changes in ",event);
// // });
// // $('#threadlist_rows').bind('DOMSubtreeModified',function(event) { 
// //     console.log("Something has changed inside .classname or #id"); 
// //     console.log("Ennnnnnn");
// //  console.log("Changes in ",event);
// // }); 

// let firstImg;
// let observerConfig;
// let firstImgObserver;
// firstImg = $('#threadlist_rows');
// observerConfig = {
//     attributes: true,
//     childList: true,
//     characterData: true
// };

// firstImgObserver = new MutationObserver(function (mutations) {
//     mutations.forEach(function (mutation) {
//         var newVal = $(mutation.target).prop(mutation.attributeName);
//         if (mutation.attributeName === "class") {
//             console.log("MutationObserver class changed to222222", newVal);
//         } else if (mutation.attributeName === "id") {
//             console.log("MutationObserver id changed to11111", newVal);
//         }
//     });
// });


// firstImg.on("DOMAttrModified", function (e) {
//     var newVal = $(this).prop(e.originalEvent.attrName);
//     console.log("DOMAttrModified Yoyo", e.originalEvent.attrName, "changed to Nono", newVal);
// });
// select the target node
var target = document.querySelector('#threadlist_rows');

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        
        //console.log(mutation.target)
        
        $(mutation.target).find('.unreadMessage').each( async function() {
            //console.log("Yo  Yo");
            let senderUrl=$(this).find('a').attr("href"); 
            //console.log(senderUrl);
            chrome.runtime.sendMessage({type: "StoreMessageLinkInLocalStorage", options: senderUrl});
        });
        
    });
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }

// pass in the target node, as well as the observer options
observer.observe(target, config);