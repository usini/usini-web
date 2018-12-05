/* 
    Generate Metro UI Panel
        HTML TEMPLATE
*/
// https://metroui.org.ua/panels.html

class UsiniTemplate{
    constructor(){
    }

    panel(id="new", text="empty", content="NEW", data_collapsed=false){
    let template = `<div id="panel_${id}"
                data-role="panel"
                data-on-collapse="localStorage['panel_${id}'] = 0;"
                data-on-expand="localStorage['panel_${id}'] = 1;")
                data-collapsed="${data_collapsed}"
                data-title-caption="${text}"
                data-collapsible="true">

                ${content}

                <ul class="t-menu open compact horizontal">
                    <li><a href="#"><span class="mif-cancel icon"></span></a></li>
                </ul>
            </div>`;
    return template;
    }

    settings(){
        let template=`<ul>
                        <li id="carrier_ip"></li>
                        <li id="carrier_ws"></li>
                        <li id="carrier_channels"></li>
                    </ul>`;
        return template;
    }

    qrcode(){
        let template=`<div id="qrcode"></div>`;
        return template;
    }

    monitor(device){
        let template=`<div id="${device.channel}"><textarea id="text_${device.channel}"></textarea></div>`;
        return template;
    }


}