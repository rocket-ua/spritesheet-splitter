import EventEmitter from "../event/EventEmitter";
import ResourcesManager from "../resources/ResourcesManager";

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
        this.gameXHR.open('GET', loadData.url, true);
        this.gameXHR.responseType = "blob";
        this.gameXHR.send();
    }

    onError(event) {

    }

    onLoad(event) {
        if (this._loaderStack.length > 0) {
            this.load();
        } else {
            console.log('All loaded');
            this._inProgress = false;
            this.emit('allComplete');
        }
        this.fileLoadingComplete(event.target);
    }

    fileLoadingComplete(data) {
        let name = data.responseURL.substring(data.responseURL.lastIndexOf('/') + 1);
        ResourcesManager.addResource(name, data.response);
        if (data.response.type === 'application/json') {
            let resource = ResourcesManager.getData(name);
            resource.on('loaded', ()=>{
                resource.textures.forEach((textureData)=>{
                    this.add(data.responseURL.replace(name, textureData.name));
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
