import DataResource from "../DataResource";

export default class BitmapFontResource extends DataResource {
    constructor(name, srcData, data) {
        super(name, srcData, data);
    }

    _parseData() {
        if (this._data) {
            this._textures = [];
            let common = this._data.getElementsByTagName('common')[0];

            let pages = this._data.getElementsByTagName('pages')[0];
            for (let i = 0; i < pages.children.length; i++) {
                this._textures[pages.children[i].getAttribute('id')] =
                    {
                        name: pages.children[i].getAttribute('file'),
                        size: {
                            w: undefined,
                            h: undefined
                        }
                    }
            }

            let chars = this._data.getElementsByTagName('chars')[0];
            for (let i = 0; i < chars.children.length; i++) {
                let spriteSrcData = chars.children[i];
                this._sprites[spriteSrcData.getAttribute('id').toString()] = {
                    frame: {
                        x: +spriteSrcData.getAttribute('x'),
                        y: +spriteSrcData.getAttribute('y'),
                        w: +spriteSrcData.getAttribute('width'),
                        h: +spriteSrcData.getAttribute('height')
                    },
                    rotated: false,
                    trimmed: false,
                    spriteSourceSize: {
                        x: 0,
                        y: 0,
                        w: +spriteSrcData.getAttribute('width'),
                        h: +spriteSrcData.getAttribute('height')
                    },
                    sourceSize: {
                        w: +spriteSrcData.getAttribute('width'),
                        h: +spriteSrcData.getAttribute('height')
                    },
                    scale: {
                        x: (+common.getAttribute('scaleW') || 1),
                        y: (+common.getAttribute('scaleH') || 1)
                    },
                    textureName: this._textures[+spriteSrcData.getAttribute('page')].name
                }
            }
        }
    }

    _parseSrcData() {
        if (this._srcData) {
            console.log(`[BitmapFontResource] Start prepare data ${this._name}`);
            this.data = new DOMParser().parseFromString(event.target.result, "application/xml");
            this._ready = true;
            console.log(`[BitmapFontResource] Prepare data complete ${this._name}`);
            this.emit('loaded');
        }
    }
}
