$(function() {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        //here we get the url change 
        //console.log("URL CHANGED: " + request.data.url);

        var str = "" + request.tabData.url;
        var groupId = str.substring(32);
        groupId = groupId.slice(0, -1);

        // incomplete, should rewrite by regex!
        if (str.indexOf("groups") > -1 && request.tabData.status == "complete"&&request.auth!=null) {

        	console.log('is group ID');
            //save data
            var feedURL = "https://graph.facebook.com/" + groupId + "/feed";
            $.ajax({
                url: feedURL,
                data: {
                    "access_token": request.auth.accessToken
                },
                dataType: "json",
                success: function(res) {
                    // deal with each feed 
                    for (var i = 0; i < res.data.length; i++) {
                        // use some algorithm to check the format for store
                        // still incomplete
                        if (res.data[i].message_tags != null) {
                            savedata(res.data[i], request.auth.userID, groupId);
                            console.log("try to save "+i+" feed");
                        } else {
                            continue;
                        }
                    }
                }
            });

            //extract data
            var $ul = $('<ul></ul>');
            var lag=setTimeout(function(){$.post('http://localhost:8080/FBSearch_ver0/ExtractData',
            	{
            		"groupId":groupId
            	},
            	function(data){
            		console.log('extract data success');
            		// tags and task are ???
            		console.log(data);

            		//apend each data
            		$.each(data,function(i,item){
            			var $li = $('<li><div class="" id="" onclick="">' +
            			    '</div><div class="remove"></div></li>');
            			$li.find("div:first").attr("id", item.id);
            			$li.find("div:first").text(item.tags+" - "+item.task+"   deadline: "+item.deadline);
            			$li.appendTo($ul);


            			//apend to ego_section
            			var $div = $('<div></div>');
            			$div.addClass('ego_unit_container');
            			$div.attr('id','testMission');
            			$ul.appendTo($div);
            			var t = setTimeout(function() {
            			    $('.ego_section').empty();
            			    $div.appendTo('.ego_section:first');
            			}, 1000);

            		});

            	},
            	'json'
            	);},5000);

        } else {
            console.log("is not groups url");
        }


    });

});


function savedata(feed, userId, groupId) {

    // key is the offset of name in the message
    for (key in feed.message_tags) {

        // array tags for names(tags 0 for first name,still not deal with tag[i])
        var tags = feed.message_tags[key];
        var tag = tags[0].name;

        var namesize = tags[0].length;
        var index = feed.message.indexOf(" - ");
        var start = parseInt(key) + namesize + 1;
        var size = index - start;
        var task = feed.message.substr(start, size);

        var create_time = feed.created_time;
        var tempt = feed.message.substr(index + 3, 10);
        var deadline = tempt;

        if (index != -1 || size != 0 || feed.message.indexOf("/") == index + 5) {
            // duplicate data still wait for deal with!
            // use feedId to deal with 
            $.post("http://localhost:8080/FBSearch_ver0/SaveData", {
                    "userId": userId,
                    "groupId": groupId,
                    "feedId": feed.id,
                    "task": task,
                    "tags": tag,
                    "orderTime": create_time,
                    "deadline": deadline
                },
                function(data) {
                    console.log(data);
                },
                "json"
            );
            break;
        } else {
        	console.log("check fail");
            console.log("There is no data in format for store");
            break;
        }
    }
};
