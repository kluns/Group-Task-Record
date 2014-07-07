
var loginMessage=null;


// check the status of login
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

    // console.log(message.authResponse);
    loginMessage=message.authResponse;
	
});




//Listen for when a Tab changes state
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo && changeInfo.status == "complete"&&loginMessage!=null){
        console.log("Tab updated: " + tab.url);

        console.log(loginMessage);
        

        //when tab is not permission in manifest.json, cannot send message to execute.js but console.log
        chrome.tabs.sendMessage(tabId, {tabData: tab, auth:loginMessage}, function(response) {
            // callback will fire if the sendMessage fail
            console.log('tab is not permission(send message fail from background.js)');
        });

    }
});


// add a listener to listen loginMessage if is null
// 
// 