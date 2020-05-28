import ResourceLoader from "./loader/ResourceLoader";
import UploadManager from "./loader/UploadManager";
import Renderer from "./renderer/Renderer";
import Exporter from "./export/Exporter";
import ResourceManager from "./resources/ResourcesManager";

export default class App {
    constructor() {
        this.init();
        this.addListeners();
        //this.loadResources();
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
        //ResourceLoader.add('./assets/game-7.json');
        ResourceLoader.add('https://book-of-pirates.dev.onlyplay.net/assets/game/game-1.json');
        ResourceLoader.load();
    }

    allResourcesLoaded() {

    }
}
//new App();
