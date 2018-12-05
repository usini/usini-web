/*
Generate UsiniCarrier Scan
scanner = new UsiniScan();

scanner = new UsiniScan(
    interval=1000,{
        url: false, //websocket url (ex:ws://127.0.0.1:42000)
        password: false, //Set a password
        creator: false, //Create channel if it doesn't exists
        debug: true, //Debug message in console
        localStorage: true, //Use localStorage to save url/password
        guessChannel: true //Guess channel name
    });
    */


    class UsiniScan {
        constructor(interval = 1000, settings = {debug:false}){
            this.devices = {};
            this.carrier = false;
            this.interval = false;
            this.settings = settings;
            this.ondetected = function(){};
            this.onremoved = function(){};
        }

        //Start scan
        start(){
            this.carrier = new LibreCarrier("",this.settings);
            this.scanning = false;
        }

        //Stop scan
        stop(){
            clearInterval(this.interval);
        }
    }