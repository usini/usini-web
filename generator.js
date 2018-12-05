class UsiniPanels{
    //parent_id =  id where the grid will be create
    //name = id of the grid
    constructor(id="body", name="usini-panels"){
        this.nb_panels = 0;
        this.panels = {};
        this.name = name;
        this.id = id;
    }

    remove(panel){
        $(panel.id).parent().remove();

    }

    create_panel(id,text,content){
        let data_collapsed;
        let html_id = "#panel_" + id;
        this.panels[id] = { "id": html_id, "text": text };
        //Check state of panel
        if (localStorage["panel_"+id] !== undefined){
            if(localStorage["panel_"+id] == 1){
                data_collapsed = true;
            }
            if(localStorage["panel"+id] == 0){
                data_collapsed = false;
            }
        } else {
            localStorage["panel_"+id] = 0;
            data_collapsed = false;
        }
        let state = localStorage["panel_"+id];

        console.log(`[ ${this.name} ] --> [ panel_${text} - ${state}]`);

        let template = `<div id="panel_${id}" 
                         data-role="panel" 
                         data-on-collapse="localStorage['panel_${id}'] = 1;" 
                         data-on-expand="localStorage['panel_${id}'] = 0;") 
                         data-collapsed="${data_collapsed}" 
                         data-title-caption="${text}" 
                         data-collapsible="true">
                         ${content}
                         <ul class="t-menu open compact horizontal">
                            <li><a href="#"><span class="mif-cancel icon"></span></a></li>
                        </ul>
                    </div>`
        this.nb_panels++;
        $(this.id).append(template);
    }

    create_qrcode(){
        let content=`<div id="qrcode"></div>`;
        this.create_panel("qrcode","QR Code",content);
        new QRCode(document.getElementById("qrcode"), { text: window.location.href });
    }

    create_settings(){
        let content=`<ul>
                        <li id="carrier_ip"></li>
                        <li id="carrier_ws"></li>
                        <li id="carrier_channels"></li>
                     </ul>`
        this.create_panel("settings","Configuration",content);
        $("#carrier_ip").html('<a href="'+window.location.href+'">Adresse: '+window.location.href+'</a>');
        $("#carrier_ws").html('Websocket: '+ carrier.url);
        this.nb_panels++;             
    }

    create_component(component){
        if(component.role = "monitor"){
            let content=`<textarea id="${component.channel}"></textarea>`;
            let name = component.channel;
            this.create_panel(component.channel,name,content);
        }
    }
}

function generate_card(node_port, node_name, node_image){
    html = `<div class="img-container">
                <textarea id="${node_name}" data-auto-size data-role="textarea"></textarea>
                <img width=200 id="${node_image}" src="">
            </div>`;
}

