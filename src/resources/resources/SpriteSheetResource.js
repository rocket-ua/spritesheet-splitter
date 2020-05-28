import EventEmitter from "../../event/EventEmitter";
import ResourcesManager from "../ResourcesManager";

export default class SpriteSheetResource extends EventEmitter {
    constructor(name) {
        super();
        this._name = name.substring(0, name.lastIndexOf('.'));
        this._type = 'spriteSheet';
        this._textures = [];
        this._data = {};
        this._ready = false;

        this._onDataReady = this._onDataReady.bind(this);
        this._onTexturesReady = this._onTexturesReady.bind(this);
    }

    _onDataReady() {
        let texturesPromises = [];
        this._data.textures.forEach((textureDara) => {
            let texture = ResourcesManager.getTexture(textureDara.name);
            texturesPromises.push(texture.promise);
            this._textures.push(texture);
        });
        Promise.all(texturesPromises).then(this._onTexturesReady);
    }

    _onTexturesReady() {
        this._ready = true;
    }

    getSpriteData(name) {
        return this._data.sprites[name];
    }

    getTexture(name) {
        return this._textures.find((texture) => {
            return texture.name === name;
        });
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this._data.promise.then(this._onDataReady);
    }

    get textures() {
        return this._textures;
    }

    set textures(value) {
        this._textures = value;
    }

    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get ready() {
        return this._ready;
    }

    get texture() {
        return this._textures[0];
    }
}
