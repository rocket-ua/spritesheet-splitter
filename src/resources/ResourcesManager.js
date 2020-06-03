import TextureResource from "./resources/TextureResource";
import SpriteSheetResource from "./resources/SpriteSheetResource";
import FileTypeChecker from "../prepare/FileTypeChecker";

export default new class ResourcesManager {
    constructor() {
        this._textures = {};
        this._data = {};
        this._spriteSheets = {};
    }

    addResource(name, data) {
        return new Promise((resolve, reject)=>{
            FileTypeChecker.check(data).then((resultData) => {
                let resource = null;
                switch (resultData.typeData.type) {
                    case 1:
                        resource = this.getData(name, resultData.typeData, resultData.srcData);
                        this.getSpriteSheet(name).data = resource;
                        break;
                    case 2:
                        resource = this.getTexture(name, resultData.typeData, resultData.srcData);
                        break;
                }
                resolve(resource);
            }, () => {
                console.log(`[ResourcesManager] Unsupported file type`);
                reject();
            });
        })

    }

    getData(name, typeData, data) {
        if (!this._data.hasOwnProperty(name)) {
            this._data[name] = new typeData.resourceClass(name);
        }
        if (data !== undefined) {
            this._data[name].srcData = data;
        }
        return this._data[name];
    }

    getTexture(name, typeData, data) {
        if (!this._textures.hasOwnProperty(name)) {
            if (typeData === undefined) {
                typeData = {resourceClass: TextureResource, type: 2};
            }
            this._textures[name] = new typeData.resourceClass(name);
        }
        if (data !== undefined) {
            this._textures[name].srcData = data;
        }
        return this._textures[name];
    }

    getSpriteSheet(name) {
        if (!this._spriteSheets.hasOwnProperty(name)) {
            this._spriteSheets[name] = new SpriteSheetResource(name);
            this._spriteSheets['spriteSheet'] = this._spriteSheets[name];
        }
        return this._spriteSheets[name];
    }
}
