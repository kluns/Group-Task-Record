function savedata(userId, groupId) {
    // console.log(arr[0].message_tags.keys);
    FB.api("./" + groupId + "?fields=feed", function(res) {
        var arr = res.feed.data;

        // key is the offset of name in the message
        for (key in arr[0].message_tags) {

	        // console.log(arr[0]);
            var user = userId;

            var feedId=arr[0].id;
            // array tags for names
            var tags = arr[0].message_tags[key];
            var tag = tags[0].name;

            var namesize = tags[0].length;
            var index = arr[0].message.indexOf(" - ");
            var start = parseInt(key) + namesize + 1;
            var size = index - start;
            var task = arr[0].message.substr(start, size);

            var create_time = arr[0].created_time;
            var tempt = arr[0].message.substr(index + 3, 10);
            var deadline = tempt;

            // duplicate data still wait for deal with!
            // use feedId to deal with 
            $.post("SaveData", {
                    "userId": user,
                    "groupId": groupId,
                    "feedId": feedId,
                    "task": task,
                    "tags": tag,
                    "orderTime": create_time,
                    "deadline": deadline
                },
                function(data) {
                	console.log('save data success');
                    console.log(data);
                },
                "json"
            );

            break;

        }
    });


};

function extractdata(groupId){
	$.post('ExtractData',
		{
			"groupId":groupId
		},
		function(data){
			console.log('extract data success');
			// tags and task are ???
			console.log(data);
		},
		'json'
		);
};



$(function() {


});
