/* 
    Generate Metro UI Panel
        Javascript
*/
// https://metroui.org.ua/panels.html

class UsiniPanels{
    //parent_id =  id where the grid will be create
    //name = id of the grid
    constructor(id="body", name="usini-panels"){
        this.nb_panels = 0;
        this.panels = {};
        this.name = name;
        this.id = id;
        this.template = new UsiniTemplate();
    }

    //Remove a panel
    remove(panel){
        $(this.panels[panel].id).parent().remove();
    }

    /* Create a panel
        id: id of the panel (for ex: qrcode --> #panel_qrcode)
        text: text display on the panel
        content:
    */
    panel(id,text,content){
        let data_collapsed;
        let html_id = "#panel_" + id;
        this.panels[id] = { "id": html_id, "text": text };

        //Store if panel is collapsed in localStorage
        if (localStorage["panel_"+id] !== undefined){ //localStorage
            if(localStorage["panel_"+id] == 0){ //Collapsed
                data_collapsed = true;
            }
            if(localStorage["panel"+id] == 1){ //Visible
                data_collapsed = false;
            }
        } else {
            localStorage["panel_"+id] = 1; //Save as Visible by default
            data_collapsed = false;
        }
        let state = localStorage["panel_"+id];

        console.log(`[ ${this.name} ] --> [ panel_${text} - ${state}]`);
        this.nb_panels++;
        $(this.id).append(this.template.panel(id,text,content,data_collapsed));
    }

    /*
        Create a settings panel
    */

   settings(carrier_url){
    this.panel("settings","Configuration",this.template.settings());;
    $("#carrier_ip").html('<a href="'+window.location.href+'">Adresse: '+window.location.href+'</a>');
    $("#carrier_ws").html('Websocket: '+ carrier_url);
    this.nb_panels++;
}

    /*
        Create a qrcode panel
    */
    qrcode(){
        this.panel("qrcode","QR Code",this.template.qrcode());
        new QRCode(document.getElementById("qrcode"), { text: window.location.href });
    }

    /*
        Create a device panel
    */

    device(device){
        if(device.role = "monitor"){
            let name = device.channel;
            this.panel(device.channel,name,this.template.monitor(channel));
        }
    }
}
/*
function generate_card(node_port, node_name, node_image){
    html = `<div class="img-container">
                <textarea id="${node_name}" data-auto-size data-role="textarea"></textarea>
                <img width=200 id="${node_image}" src="">
            </div>`;
}
*/