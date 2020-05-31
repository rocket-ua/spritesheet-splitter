import Vue from "vue";

export default new class DownloadPopup {
    constructor() {
        Vue.component('download-popup', {
            data: () => {
                return {
                    show: false
                }
            },
            template: `
                <div v-if="show">
                    <button v-on:click="show = !show">Download</button>
                </div>
            `,
        });
    }
}
