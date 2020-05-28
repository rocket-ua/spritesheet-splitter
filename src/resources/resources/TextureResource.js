import Resource from "../Resource";

export default class TextureResource extends Resource {
    constructor(name, srcData, data) {
        super(name, srcData, data);

        this.data = new Image();
    }

    _parseSrcData(value) {
        if (this._srcData) {
            this._type = this._srcData.type;
            let fileReader = new FileReader();
            fileReader.addEventListener('loadend', (event) => {
                this.data.src = event.target.result;
                this._ready = true;
                this.emit('loaded');
            }, false);
            fileReader.readAsDataURL(this._srcData);
        }
    }

    get width() {
        return this.data ? this.data.width : 0;
    }

    get height() {
        return this.data ? this.data.height : 0;
    }
}
