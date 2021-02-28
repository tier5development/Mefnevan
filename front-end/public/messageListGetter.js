
console.log("I am in Message JS ");

$('#threadlist_rows').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
 console.log("Ennnnnnn");
 console.log("Changes in ",event);
});