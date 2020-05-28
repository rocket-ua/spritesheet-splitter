import TextureResource from "./resources/TextureResource";
import JSONResource from "./resources/JSONResource";
import SpriteSheetResource from "./resources/SpriteSheetResource";
import BitmapFontResource from "./resources/BitmapFontResource";

export default new class ResourcesManager {
    constructor() {
        this._fileTypes = {
            'image/jpg': {class: TextureResource, type: 2},
            'image/jpeg': {class: TextureResource, type: 2},
            'image/png': {class: TextureResource, type: 2},
            'application/json': {class: JSONResource, type: 1},
            'text/xml': {class: BitmapFontResource, type: 1},
        }

        this._textures = {};
        this._data = {};
        this._spriteSheets = {};
    }

    addResource(name, data) {
        let resource = null;
        let type = this.getSrcResourceType(data);
        let typeData = this._fileTypes[type];
        switch (typeData.type) {
            case 1:
                resource = this.getData(name, typeData, data);
                this.addSpriteSheet(name);
                break;
            case 2:
                resource = this.getTexture(name, typeData, data);
                break;
        }

        /*let resource = null;
        let type = this.getSrcResourceType(data);
        switch (type) {
            case 'image/jpg':
                resource = this.getTexture(name);
                break;
            case 'image/png':
                resource = this.getTexture(name);
                break;
            case 'application/json':
                resource = this.getData(name);
                this.addSpriteSheet(name);
                break;
        }

        if (resource) {
            resource.srcData = data;
        }*/
    }

    addSpriteSheet(name) {
        let spriteSheet = new SpriteSheetResource(name);
        spriteSheet.data = this._data[name];

        this._spriteSheets[name] = spriteSheet;
        this._spriteSheets['spriteSheet'] = spriteSheet;
    }

    getSrcResourceType(data) {
        if (data.type) {
            return data.type;
        } else if (data.name) {
            let index = data.name.lastIndexOf('.');
            return data.name.substring(index + 1).toLocaleLowerCase();
        }
        return '';
    }

    getData(name, typeData, data) {
        if (!this._data.hasOwnProperty(name)) {
            if (typeData === undefined) {
                typeData = {class: JSONResource, type: 1};
            }
            this._data[name] = new typeData.class(name);
        }
        this._data[name].srcData = data;
        return this._data[name];
    }

    getTexture(name, typeData, data) {
        if (!this._textures.hasOwnProperty(name)) {
            if (typeData === undefined) {
                typeData = {class: TextureResource, type: 2};
            }
            this._textures[name] = new typeData.class(name);
        }
        this._textures[name].srcData = data;
        return this._textures[name];
    }

    /*getData(name) {
        if (!this._data.hasOwnProperty(name)) {
            this._data[name] = new JSONResource(name);
        }
        return this._data[name];
    }

    getTexture(name) {
        if (!this._textures.hasOwnProperty(name)) {
            this._textures[name] = new TextureResource(name);
        }
        return this._textures[name];
    }*/

    getSpriteSheet(name) {
        return this._spriteSheets[name];
    }
}
