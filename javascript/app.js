// id = 1;
// uname = "bhargava";
function login() {
    let user_name = document.getElementById("user-name");
    if(user_name.value == "") {
        document.getElementById("user").innerHTML = "Logged in as Guest";
        document.getElementById("user").name = "guest";
    }
    else {
        document.getElementById("user").innerHTML = "Logged in as "+user_name.value;
        document.getElementById("user").name = user_name.value;
    }
    getChannels();
    document.getElementById("login-section").remove();
    console.log(document.getElementById("user").name)
}

function openChannel(channel_id) {
    fetch("http://0.0.0.0:5000/channels")
    .then(response => response.json())
    .then(json_db_object => json_db_object['resources'])
    .then(channel_ids => {
        channel_ids.forEach(channel => {
            if(channel['id'] == channel_id) {
                document.getElementById("channel-name").innerHTML = channel['name'];
                document.getElementById("channel-name").name = channel['id'];
                getMessages(channel_id);
            }
        });
    })
}


