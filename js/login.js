var testHTML = '<div id="testClick">' + 'Login!' + '</div>';


function startTest() {
    var $btn = $(testHTML);
    $btn.appendTo('body');
}


$(function() {


    //create a button
    startTest();
    $('#testClick').click(function() {

        window.open("http://localhost:8080/FBSearch_ver0/index.html", "_blank");


    });

    window.addEventListener('message', function(msg) {

        // if and else to determine the msg is what I want (auth)
        if (typeof(msg.data) == "object") {
            if (msg.data.status === "connected") {
                var auth = msg.data.authResponse;
                chrome.runtime.sendMessage({
                    "authResponse": auth
                }, function(res) {
                    // if sendmessage fail the callback will execute
                    console.log('send status message fail from login.js');
                });

                $('#testClick').remove();

            }
            else{
            	console.log("is object but status is not connected");
            }


        } else {
            console.log('this event is not trigger by login (message from login.js)');
        }
    }, false);
});
