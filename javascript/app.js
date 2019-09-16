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

function getMessages(channel_id){
    fetch("http://0.0.0.0:5000/messages")
    .then(response => response.json())
    .then(json_db_object => json_db_object['resources'])
    .then(messages => {
        inbox_node = document.getElementById("inbox");
        inbox_node.innerHTML = "";
        messages.forEach(message => {
            if(message['channel_id'] == channel_id) {
                message_node = document.createElement("li");
                user_node = document.createElement("b");
                message_text = document.createTextNode(message['text']);
                user_name = document.createTextNode(message['username']+" : ");
                user_node.appendChild(user_name);
                message_node.appendChild(user_node);
                message_node.appendChild(message_text);
                inbox_node.appendChild(message_node);
            }
        })
    })
}

function getChannels(){
    fetch("http://0.0.0.0:5000/channels")
    .then(response => response.json())
    .then(json_db_object => json_db_object['resources'])
    .then(channels => {
        inner_html = "";
        channels.forEach(channel => {
            inner_html += '<li><button id="' + channel['id'] + '" class="channel" onClick="openChannel(this.id);">' + channel['name'] + '</button></li>';
        }
        )
        channels_list = document.getElementById('channels');
        channels_list.innerHTML = "";
        channels_list.innerHTML = inner_html;            
    });
}

function sendMessage() {
    let message = document.getElementById('message').value;
    let user_name = document.getElementById("user").name;
    let channel_id = document.getElementById("channel-name").name
    if(channel_id!=null && message != ""){
        fetch("http://0.0.0.0:5000/messages/", {
            method: 'POST',
            body: JSON.stringify(
                { 
                    'username' : user_name,
                    'text' : message,
                    'channel_id' : channel_id
                })
        })
        .then(() => getMessages(channel_id))
        .catch(error => console.log(error))
        broadcastMessage(channel_id, user_name, message);
    }
    document.getElementById('message').value = "";
}

function broadcastMessage(channel_id, user_name, message){
        fetch("http://0.0.0.0:5000/broadcast", {
        method: 'POST',
        body: JSON.stringify(
            { 
                'username' : user_name,
                'text' : message,
                'channel_id' : channel_id
            }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
function addChannel() {
    let channel_name = document.getElementById('new-channel').value;
    if(channel_name != ""){
        fetch("http://0.0.0.0:5000/channels/", {
            method: 'POST',
            body: JSON.stringify(
                { 
                    'name' : channel_name,
                })
        })
        .then(() => getChannels());
        broadcastChannel(channel_name);
    }
    document.getElementById('new-channel').value = "";
}

function broadcastChannel(channel_name) {
    fetch("http://0.0.0.0:5000/broadcast", {
            method: 'POST',
            body: JSON.stringify(
                { 
                    'name' : channel_name,
                }),
            headers: {
                    'Content-Type': 'application/json'
                }
        })
}

document.getElementById('message').value = "";
document.getElementById('user-name').value = "";
document.getElementById("login").addEventListener("click", login);
document.getElementById("send").addEventListener("click", sendMessage);
document.getElementById("add-channel").addEventListener("click", addChannel);
