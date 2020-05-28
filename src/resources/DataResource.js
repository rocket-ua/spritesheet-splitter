import Resource from "./Resource";

export default class DataResource extends Resource {
    constructor(name, srcData, data) {
        super(name, srcData, data);

        this._textures = {};
        this._sprites = {};
    }

    get textures() {
        return this._textures;
    }

    get sprites() {
        return this._sprites;
    }
}
