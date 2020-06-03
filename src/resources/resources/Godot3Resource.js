import DataResource from "../DataResource";

export default class Godot3Resource extends DataResource {
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

                textureData.sprites.forEach((spriteData)=>{
                    this._sprites[spriteData.filename] = {
                        frame: spriteData.region,
                        rotated: false,
                        trimmed: true,
                        spriteSourceSize: {
                            x: spriteData.margin.x,
                            y: spriteData.margin.y,
                            w: spriteData.region.w,
                            h: spriteData.region.h
                        },
                        sourceSize: {
                            w: spriteData.region.w + spriteData.margin.w,
                            h: spriteData.region.h + spriteData.margin.h
                        },
                        scale: {
                            x: 1,
                            y: 1
                        },
                        rotation: spriteData.rotated ? -90 : 0,
                        textureName: textureData.image
                    }
                });
            });
        }
    }

    _parseSrcData() {
        if (this._srcData) {
            console.log(`[Godot3Resource] Start prepare data ${this._name}`);
            this.data = JSON.parse(this._srcData);
            this._ready = true;
            console.log(`[Godot3Resource] Prepare data complete ${this._name}`);
            this.emit('loaded', this);
        }
    }
}
