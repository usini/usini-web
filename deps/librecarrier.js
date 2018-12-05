/*
Name:        Wrapper for LibreCarrier
Author:      Remi Sarrailh
Version:     0.3
Licence:     MIT
Description: Manages Login / Reconnection
URL:
*/

function saveLocal(item, value){
    if(localStorage){
        localStorage[item] = value;
    }
}

function removeLocal(item){
    if(localStorage){
        localStorage.removeItem(item);
    }
}

function guessWebSocket(){
    protocol = "";
    address = location.host;
    url = "";
    current_url = window.location.href.split(":");
    switch (current_url[0]) {
        case "http":
        protocol = "ws://";
        break;
        case "https":
        protocol = "wss://";
        break;
        case "file":
        protocol = "ws://";
        address = "127.0.0.1:42000";
    }
    url = protocol + address + "/ws";
    return url;
}

class LibreCarrier extends ReconnectingWebSocket{
    constructor(channel = "", options = {}){
        let settings = {
            url: false, //websocket url (ex:ws://127.0.0.1:42000/ws)
            password: false, //Set a password
            creator: false, //Create channel if it doesn't exists
            debug: true, //Debug message in console
            localStorage: true, //Use localStorage to save url/password
            guessChannel: true //Guess channel name
        };

        if(settings.url == false){
            if(localStorage.librecarrier_url === undefined){
                settings.url = guessWebSocket();
               saveLocal("librecarrier_url",settings.url);
            } else {
                settings.url = localStorage.librecarrier_url;
            }
        }
        super(settings.url , null, {timeoutInterval: 10000});

        for (var key in settings) {
            if (typeof options[key] !== 'undefined') {
                this[key] = options[key];
            } else {
                this[key] = settings[key];
            }
        }

        if(localStorage.librecarrier_password !== undefined){
            if(this.password == false){
                this.password = localStorage.librecarrier_password;
            }
        }
        
        //Websocket Settings
        this.channel = channel;
        this.logged = false;

        this.channels = [];
        this.passwordAttempt = 0;
        this.debugMessage("URL : " + this.url);
        this.onreceived = function(message){this.debugMessage(message)};
        this.onlogged = function(){};
    }

    debugMessage(message){
        if(this.debug){
            console.log(this.channel + " --> " + message);
        }
    }

    onopen(){
    }

    onerror(error){
        this.debugMessage("... Error "+ this.reconnectAttempts);
        if(this.reconnectAttempts > 5){
            this.urlError();
        }
    }

    onclose(error){
        this.debugMessage("... Closed");
        this.logged = false;
    }

    passwordError(){
        this.password = window.prompt("Password ?" , "");
        if(this.password == null){
            this.close();
        } else {
            this.login();
        }
    }

    urlError(){
        this.url = window.prompt("URL ?", this.url);
        if(this.url == null){
            this.removeLocal("librecarrier_url");
            this.close();
        } else {
            carrier.saveLocal("librecarrier_url", this.url);
            this.refresh();
        }
    }

    connect(){
        //console.log(this.guessChannel);
        if(this.guessChannel){
            let potentialChannels = [];
            for (var i = 0; i < this.channels.length; i++) {
                if(this.channels[i].search(this.channel) != -1){
                    potentialChannels.push(this.channels[i]);
                }
                //console.log(chan.search(this.channel));
            }
            //console.log(potentialChannels);

            if(potentialChannels.length > 0){
                if(potentialChannels.length == 1){
                    this.channel = potentialChannels[0];
                } else {
                    this.connectDialog(potentialChannels);
                }
            } else {
                this.connectDialog(potentialChannels);
            }
        } else {
            this.debugMessage("No guessing channel");
        }
        this.debugMessage("... Connecting to "+this.channel);
        this.send('{"connect":"'+this.channel+'"}');
    }

    connectDialog(chans){
        var dialog_message = "";
        for (var i = 0; i < chans.length; i++) {
            dialog_message = dialog_message + " " + chans[i];
        }
        answer = window.prompt("Channel ?", dialog_message);
        if(answer != null){
            this.channel = answer.trim();
        }
    }

    login(){
        this.debugMessage("... Login");
        if(this.password == false){
            this.passwordError();
            this.passwordAttempt++;
        } else {
            this.send('{"password": "'+this.password+'"}');
        }
    }

    add(){
        this.debugMessage("... Creating "+this.channel);
        this.send('{"add":"'+this.channel+'"}');
    }

    onmessage(message){
        //debugMessage(message.data);
        if (this.logged){
            this.onreceived(message.data);
            if(message.data == "@disconnected@"){
                this.refresh();
            }
        } else {

            if(this.channel != ""){
                this.onreceived(message.data);
            }

            if (this.IsJsonString(message.data)){
                var command = JSON.parse(message.data);
                if(command.password !== undefined){
                    if(this.passwordAttempt == 0){
                        this.login();
                    } else {
                        this.debugMessage("... Invalid Password");
                        this.passwordError();
                    }
                }
                if(command.channels !== undefined){
                    this.channels = command.channels;
                    if(this.channel != ""){
                        this.connect();
                    } else {
                        this.onlogged();
                    }
                    if(this.passwordAttempt > 0){
                        this.debugMessage("... Saved password");
                        saveLocal(this.password);
                    }
                }

                if(command.ok !== undefined){
                    switch (command.action) {
                        case "add":
                        this.logged = true;
                        this.debugMessage("... Created " + command.ok);
                        break;
                        case "connect":
                        this.debugMessage("... Connected to " + command.ok);
                        this.logged = true;

                        break;
                        default:
                        this.debugMessage("... Undefined action:" + command.action)
                        break;
                    }
                }

                if(command.error !== undefined){
                    switch (command.error) {
                        case "nochannel":
                        if(this.creator){
                            this.debugMessage("... " + this.channel + " doesn't exists")
                            this.add();
                        } else {
                            //this.debugMessage("... Retry");
                            //setTimeout(this.reconnectInterval,this.connect());
                        }
                        break;

                        default:
                        this.close();
                        this.debugMessage("... Failed");
                        this.debugMessage(command.error);
                        break;
                    }
                    //this.refresh();
                }

            }
        }
    }

    IsJsonString(str){
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}


