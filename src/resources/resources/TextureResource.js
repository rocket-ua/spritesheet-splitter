import Resource from "../Resource";

export default class TextureResource extends Resource {
    constructor(name, srcData, data) {
        super(name, srcData, data);

        this._type = 2;

        this.data = new Image();
        this.data.onload = () =>{
            this._ready = true;
            console.log(`[TextureResource] Prepare data complete ${this._name}`);
            this.emit('loaded');
        };
    }

    _parseSrcData(value) {
        if (this._srcData) {
            console.log(`[TextureResource] Start prepare data ${this._name}`);
            this.data.src = this._srcData;
        }
    }

    get width() {
        return this.data ? this.data.width : 0;
    }

    get height() {
        return this.data ? this.data.height : 0;
    }
}
