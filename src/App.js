import ResourceLoader from "./loader/ResourceLoader";
import UploadManager from "./loader/UploadManager";
import Renderer from "./renderer/Renderer";
import Exporter from "./export/Exporter";
import ResourceManager from "./resources/ResourcesManager";
import Utils from "./Utils";

export default class App {
    constructor() {
        this.init();
        this.addListeners();
        this.loadResources();
    }

    init() {
        UploadManager.init();

        this.canvas = document.getElementById("canvas");

        this.renderer = new Renderer(this.canvas);
        this.renderer.start();
    }

    addListeners() {
        this.canvas.onclick = () => {
            let names = [];
            let spriteSheet = ResourceManager.getSpriteSheet('spriteSheet');
            if (spriteSheet && spriteSheet.ready) {
                for (let param in spriteSheet.data.sprites) {
                    if (spriteSheet.data.sprites.hasOwnProperty(param)) {
                        names.push(param);
                    }
                }
                Exporter.exportImages('spriteSheet', names);
            }
        }
    }

    loadResources() {
        ResourceLoader.on('allComplete', this.allResourcesLoaded, this);
        if (Utils.getUrlParam('url')) {
            ResourceLoader.add(Utils.getUrlParam('url'));
            ResourceLoader.load();
        }
    }

    allResourcesLoaded() {

    }
}
//new App();
