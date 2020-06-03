import DataResource from "../DataResource";

export default class Phaser3Resource extends DataResource {
    constructor(name, srcData, data) {
        super(name, srcData, data);
    }

    _parseData() {
        if (this._data) {
            this._textures = [];

            this.data.textures.forEach((textureData)=>{
                this._textures.push({
                    name: textureData.image,
                    size: textureData.size
                });

                textureData.frames.forEach((frameData)=>{
                    this._sprites[frameData.filename] = {
                        frame: frameData.frame,
                        rotated: frameData.rotated,
                        trimmed: frameData.trimmed,
                        spriteSourceSize: frameData.spriteSourceSize,
                        sourceSize: frameData.sourceSize,
                        scale: {
                            x: +textureData.scale,
                            y: +textureData.scale
                        },
                        rotation: frameData.rotated ? -90 : 0,
                        textureName: textureData.image
                    }
                });
            });
        }
    }

    _parseSrcData() {
        if (this._srcData) {
            console.log(`[Phaser3Resource] Start prepare data ${this._name}`);
            this.data = JSON.parse(this._srcData);
            this._ready = true;
            console.log(`[Phaser3Resource] Prepare data complete ${this._name}`);
            this.emit('loaded', this);
        }
    }
}
