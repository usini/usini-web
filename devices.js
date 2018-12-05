//When new devices is detected
function create_device(device){
    channel = new LibreCarrier(device, {debug:false, guessChannel:false});
    channel.role = "monitor";
    channel.type = "unknown";
    channel.onreceived = receiver;
    usini.devices[device] = channel;

    usini.web.device(channel);
    $("#carrier_channels").html('Canaux: '+ usini.carrier.channels);
}

//When devices are removed
function remove_device(device){
    usini.web.remove(usini.devices[device].channel);
    $("#carrier_channels").html('Canaux: '+ usini.carrier.channels);

    usini.devices[device].close();
    delete usini.devices[device];
}

function receiver(message){
    if(this.logged){
        if(this.role == "monitor"){
            device_monitor(message,this);
        }
        if(this.role == "mysensors"){
            device_mysensors(message,this);
        }

        if(this.role == "bmep280_example"){
            device_bmep280(message,this)
        }
    }
    //console.log(this.channel + ":" + message);
    //check_bmep280(message,this.channel);
}

function device_monitor(message,device){
    $("#text_" + device.channel).html(message + $("#text_" + device.channel).html());
    if(message[1] == ";") {
        if(message.split(";").length == 6){
            console.log("Mysensors detected!");
            usini.devices[device.channel].role = "mysensors";
        }
    }
    if(message.contains("Temp:")){
        //console.log("Temp detected");
        if(message.contains("Humidity:")){
            //console.log("Humidity detected");
            if(message.contains("Pressure:")){
                usini.devices[device.channel].role = "bmep280";
            }
        }
    }
}

function device_mysensors(message,device){
    message = message.split(";");

    //Temperature
    if(message[4] == "0"){
        device.temperature = message[5].trim();
    }

    //Humidity
    if(message[4] == "1"){
        device.humidity = message[5].trim();
    }

    //Light
    if(message[4] == "37"){
        device.light = message[5].trim();
    }
    id = "#" + [device.channel];
    $(id).html(device.temperature + "°C\n");
    $(id).html($(id).html() + device.humidity + "%\n");
    $(id).html($(id).html() + device.light + " Lux\n");
}
/*
function device_bmep280(message,device){
    //console.log("Pressure detected");
    //console.log("BME280 Detected");
    temperature = message.split("°C")[0];
    temperature = temperature.split("Temp: ")[1];
    humidity = message.split("% RH")[0];
    humidity = humidity.split("Humidity: ")[1];
    pressure = message.split("Pressure: ")[1];
    pressure = pressure.split("Pa")[0];
    $("#text" + device.channel).html(temperature + "°C - " + humidity + "% - " + pressure + "Pa");
    $("#" + device.channel).attr("src","cards/sensors/sensors_temperature_humidity_barometric_bme280.svg");
    //$("#"+channel+"_text").html(temperature + "°C - " + humidity + "% - " + pressure + "Pa");
    //$("#"+channel +"_image").attr("src","cards/sensors/pro_mini_3V3_bme280.svg");
}
*/