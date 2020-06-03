import DataResource from "../DataResource";

export default class JSONHashResource extends DataResource {
    constructor(name, srcData, data) {
        super(name, srcData, data);
    }

    _parseData() {
        if (this._data) {
            this._textures = [
                {
                    name: this.data.meta.image,
                    size: this.data.meta.size
                }
            ];

            for (let spriteName in this.data.frames) {
                if (this.data.frames.hasOwnProperty(spriteName)) {
                    let spriteSrcData = this.data.frames[spriteName];
                    this._sprites[spriteName] = {
                        frame: spriteSrcData.frame,
                        rotated: spriteSrcData.rotated,
                        trimmed: spriteSrcData.trimmed,
                        spriteSourceSize: spriteSrcData.spriteSourceSize,
                        sourceSize: spriteSrcData.sourceSize,
                        scale: {
                            x: +this.data.meta.scale,
                            y: +this.data.meta.scale
                        },
                        rotation: spriteSrcData.rotated ? -90 : 0,
                        textureName: this.data.meta.image
                    }
                }
            }

        }
    }

    _parseSrcData() {
        if (this._srcData) {
            console.log(`[JSONHashResource] Start prepare data ${this._name}`);
            this.data = JSON.parse(this._srcData);
            this._ready = true;
            console.log(`[JSONHashResource] Prepare data complete ${this._name}`);
            this.emit('loaded', this);
        }
    }
}
