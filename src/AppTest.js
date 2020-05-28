import Vue from "vue";
import App from "./App";
import DownloadPopup from "./ui/DownloadPopup";

Vue.config.productionTip = false;

export default new class AppTest {
    constructor() {
        Vue.component('splitter-canvas', {
            template: `
                <div>
                    
                    <div id="splitter-panel">
                        <canvas id="canvas"></canvas>
                        <div id="bottom-panel"></div>
                    </div>
                    
                    <div id="right-panel"></div>
                    
                    <div id='dropArea'></div>
                    
                    <download-popup></download-popup>
                </div>
            `,
            mounted(){
                new App();
            }
        });
    }
}
new Vue({
    el: "#container",
    template: `
            <splitter-canvas></splitter-canvas>
        `,
});


