import EventEmitter from "../event/EventEmitter";
import ResourcesManager from "../resources/ResourcesManager";
import path from "path";

export default new class ResourceLoader extends EventEmitter {
    constructor() {
        super();
        this._inProgress = false;
        this._loaderStack = [];
        this.init();
    }

    init() {
        this.gameXHR = new XMLHttpRequest();
        this.gameXHR.addEventListener('error', this.onError.bind(this));
        this.gameXHR.addEventListener('load', this.onLoad.bind(this));
    }

    add(url) {
        this._loaderStack.push({url: url});
    }

    load() {
        this._inProgress = true;
        let loadData = this._loaderStack.shift();
        console.log(`[ResourceLoader] Start loading: ${loadData.url}`);
        this.gameXHR.open('GET', loadData.url, true);
        this.gameXHR.responseType = "blob";
        this.gameXHR.send();
    }

    onError(event) {
        console.log(`[ResourceLoader] Loading error`);
    }

    onLoad(event) {
        console.log(`[ResourceLoader] Loading complete: ${event.target.responseURL}`);
        this.fileLoadingComplete(event.target);
        if (this._loaderStack.length > 0) {
            this.load();
        } else {
            console.log(`[ResourceLoader] All files loaded`);
            this._inProgress = false;
            this.emit('allComplete');
        }
    }

    fileLoadingComplete(data) {
        let name = path.basename(data.responseURL);
        ResourcesManager.addResource(name, data.response);
        let extName = path.extname(data.responseURL);
        console.log(extName);
        if (data.response.type === 'application/json' || extName === '.atlas') {
            let resource = ResourcesManager.getData(name);
            resource.on('loaded', ()=>{
                resource.textures.forEach((textureData)=>{
                    this.add(path.dirname(data.responseURL) + '/' + textureData.name);
                });
                if (!this._inProgress) {
                    this.load()
                }
            });
        }
    }

    get loaderStack() {
        return this._loaderStack;
    }
}
