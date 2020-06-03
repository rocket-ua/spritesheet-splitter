import DataResource from "../DataResource";

export default class Panda2Resource extends DataResource {
    constructor(name, srcData, data) {
        super(name, srcData, data);
    }

    _parseData() {
        if (this._data) {
            this._textures = [
                {
                    name: this.data.meta.image,
                    size: {
                        w: undefined,
                        h: undefined
                    }
                }
            ];

            for (let spriteName in this.data.frames) {
                if (this.data.frames.hasOwnProperty(spriteName)) {
                    let spriteSrcData = this.data.frames[spriteName];
                    this._sprites[spriteName] = {
                        frame: {
                            x: spriteSrcData.x,
                            y: spriteSrcData.y,
                            w: spriteSrcData.w,
                            h: spriteSrcData.h
                        },
                        rotated: false,
                        trimmed: true,
                        spriteSourceSize: {
                            x: spriteSrcData.sx,
                            y: spriteSrcData.sy,
                            w: spriteSrcData.sw,
                            h: spriteSrcData.sh
                        },
                        sourceSize: {
                            w: spriteSrcData.w,
                            h: spriteSrcData.h
                        },
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
            console.log(`[Panda2Resource] Start prepare data ${this._name}`);
            this.data = JSON.parse(this._srcData);
            this._ready = true;
            console.log(`[Panda2Resource] Prepare data complete ${this._name}`);
            this.emit('loaded', this);
        }
    }
}
