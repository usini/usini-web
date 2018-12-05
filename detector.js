


//Refactoring in librecarrier

function generate_scan(interval){
    components = {};		
    components_list = [];
    carrier = new LibreCarrier("",{debug:false});
    carrier.onreceived = messageReceived;
    carrier.scan = false;
    carrier.onlogged = function(){
        //console.log(carrier.logged);
        if(!carrier.scan){
            get_channels();
            setInterval(get_channels, interval);
            carrier.scan = true;
            //this.connect("madnerd/leds/v2.1");
        }
    }

    function messageReceived(message){
        console.log("Message: " + message);
    }		
}

//Create a panel when a new channel exists.
//Remove a panel when a channel no longer exists.
function get_channels(){
    carrier.send("who");
    //Check if new channel exists   
    carrier.channels.forEach(function(component){
            if(components[component] === undefined){
                channel = new LibreCarrier(component, {debug:false,guessChannel: false })
                channel.role = "monitor";
                channel.type = "unknown";
                channel.onreceived = detector;
                usini.create_component(channel);
                components[component] = channel;
                $("#carrier_channels").html('Canaux: '+carrier.channels);
            }
    });

    for(component in components){
        if(!carrier.channels.includes(components[component].channel)){
            usini.remove(usini.panels[components[component].channel]);
            components[component].close();
            delete components[component];
            $("#carrier_channels").html('Canaux: '+carrier.channels);
        }
    }
    
      //console.log(carrier.channels);
}

function add_monitor(){

}

function detector(message){
    //console.log(this.role, this.channel);
    if(this.role == "monitor"){
        $("#" + this.channel).html(message + $("#" + this.channel).html());
        if(message[1] == ";") { 
           if(message.split(";").length == 6){
               console.log("Mysensors detected!");
                components[this.channel].role = "mysensors";
            }
        }
    }
    if(this.role == "mysensors"){
        message = message.split(";")
        
        //Temperature
        if(message[4] == "0"){
            $("#" + this.channel).html(message[5].trim() + "°C\n" + $("#" + this.channel).html());
        }
        
        //Humidity
        if(message[4] == "1"){
            $("#" + this.channel).html(message[5].trim() + "%\n" + $("#" + this.channel).html());
        }

        //Light
        if(message[4] == "37"){
            $("#" + this.channel).html(message[5].trim() + " Lux\n" + $("#" + this.channel).html());
        }
    }
    //console.log(this.channel + ":" + message);
    //check_bmep280(message,this.channel);
}

function check_bmep280(message,channel){
    if(message.contains("Temp:")){
        //console.log("Temp detected");
        if(message.contains("Humidity:")){
            //console.log("Humidity detected");
            if(message.contains("Pressure:")){
                //console.log("Pressure detected");
                //console.log("BME280 Detected");
                temperature = message.split("°C")[0];
                temperature = temperature.split("Temp: ")[1];
                humidity = message.split("% RH")[0];
                humidity = humidity.split("Humidity: ")[1];
                pressure = message.split("Pressure: ")[1];
                pressure = pressure.split("Pa")[0];
                $("#COM36_text").html(temperature + "°C - " + humidity + "% - " + pressure + "Pa");
		$("#COM36_image").attr("src","cards/sensors/pro_mini_3V3_bme280.svg");
		//$("#"+channel+"_text").html(temperature + "°C - " + humidity + "% - " + pressure + "Pa");
                //$("#"+channel +"_image").attr("src","cards/sensors/pro_mini_3V3_bme280.svg");
            }
        }
    }
    //console.log(message);
}

