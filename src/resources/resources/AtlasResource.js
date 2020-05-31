import DataResource from "../DataResource";

export default class AtlasResource extends DataResource {
    constructor(name, srcData, data) {
        super(name, srcData, data);
    }

    _parseData() {
        if (this._data) {
            this._textures = [];

            /*let testData1 = [...this._data.matchAll(/(^.+$)\s(^(size|format|filter|repeat):\s*(.+)\s?)+(^.+$\s?(^\s+(rotate|xy|size|index|offset|orig):\s*(.+)\s?)+)+/mig)];
            testData1.forEach((data)=>{
                let testData2 = [...data[0].matchAll(/(^.+$)\s(^(size|format|filter|repeat):\s*(.+)\s?)+/mig)];
                console.log('testData2', testData2);

                let testData3 = [...data[0].matchAll(/(^.+$\s?(^\s+(rotate|xy|size|index|offset|orig):\s*(.+)\s?))+/mig)];
                console.log('testData3', testData3);
            })*/

            let regExpSpriteSheets = /(^.+$\s?)(^(size|format|filter|repeat).+\s?)+((^.+$\s?)(^\s+(rotate|xy|size|index|offset|orig).+\s?)+)+/mig;
            let matchSpriteSheetsString = this._data.match(regExpSpriteSheets);
            matchSpriteSheetsString.forEach((spriteSheetsStringItem) => {

                let size = spriteSheetsStringItem.match(/^(?<size>size):\s*(?<width>\d*).\s*(?<height>\d*)$/mi).groups
                let textureData = {
                    name: spriteSheetsStringItem.match(/(?<name>^.+.(png|jpg)$)/mi).groups.name,
                    size: {
                        width: +size.width,
                        height: +size.height,
                    }
                }

                let regExpSprites = /(^.+$\s?)(^\s+(rotate|xy|size|index|offset|orig).+\s?)+/mig;
                let matchSpritesString = spriteSheetsStringItem.match(regExpSprites);
                matchSpritesString.forEach((matchSpritesStringItem) => {
                    //console.log(matchSpritesStringItem);
                    let spriteData = {
                        frame: {
                            x:0,    //xy[0]
                            y:0,    //xy[1]
                            w:0,    //size[0]
                            h:0     //size[1]
                        },
                        rotation: 0,
                        rotated: false, //rotate
                        trimmed: true,
                        spriteSourceSize: {
                            x: 0,   //offset[0]
                            y: 0,   //offset[1]
                            w: 0,   //size[0]
                            h: 0    //size[1]
                        },
                        sourceSize: {
                            w: 0,   //orig[0]
                            h: 0    //orig[1]
                        },
                        scale: {
                            x: 1,
                            y: 1
                        },
                        textureName: textureData.name
                    }

                    let spriteName = matchSpritesStringItem.match(/(?<name>^.+$)/mi).groups.name;
                    let testData = [...matchSpritesStringItem.matchAll(/^\s+(rotate|xy|size|index|offset|orig):\s*(.+)$/mig)];
                    let values = null;
                    testData.forEach((paramData)=>{
                        switch (paramData[1]) {
                            case 'rotate':
                                spriteData.rotated = paramData[2] === 'true';
                                spriteData.rotation = spriteData.rotated ? 90 : 0;
                                break;
                            case 'xy':
                                values = paramData[2].split(',');
                                spriteData.frame.x = +(values[0].trim());
                                spriteData.frame.y = +(values[1].trim());
                                break;
                            case 'orig':
                                values = paramData[2].split(',');
                                spriteData.sourceSize.w = +(values[0].trim());
                                spriteData.sourceSize.h = +(values[1].trim());
                                break;
                            case 'size':
                                values = paramData[2].split(',');
                                spriteData.frame.w = +(values[0].trim());
                                spriteData.frame.h = +(values[1].trim());
                                spriteData.spriteSourceSize.w = +(values[0].trim());
                                spriteData.spriteSourceSize.h = +(values[1].trim());
                                break;
                            case 'offset':
                                values = paramData[2].split(',');
                                spriteData.spriteSourceSize.x = +(values[0].trim());
                                spriteData.spriteSourceSize.y = +(values[1].trim());
                                break;
                        }
                    })
                    this._sprites[spriteName] = spriteData;
                });

                this._textures.push(textureData);
            });

            /*let regExpSpriteSheets = /(^.+$\s?)(^(size|format|filter|repeat).+\s?)+((^.+$\s?)(^\s+(rotate|xy|size|index|offset|orig).+\s?)+)+/mig;
            let matchSpriteSheetsString = this._data.match(regExpSpriteSheets);
            matchSpriteSheetsString.forEach((spriteSheetsStringItem) => {

                let size = spriteSheetsStringItem.match(/^(?<size>size):\s*(?<width>\d*).\s*(?<height>\d*)$/mi).groups
                let textureData = {
                    name: spriteSheetsStringItem.match(/(?<name>^.+.(png|jpg)$)/mi).groups.name,
                    size: {
                        width: +size.width,
                        height: +size.height,
                    }
                }

                let regExpSprites = /(^.+$\s?)(^\s+(rotate|xy|size|index|offset|orig).+\s?)+/mig;
                let matchSpritesString = spriteSheetsStringItem.match(regExpSprites);
                matchSpritesString.forEach((matchSpritesStringItem) => {
                    //console.log(matchSpritesStringItem);

                    let spriteData = {
                        frame: {
                            x:0,    //xy[0]
                            y:0,    //xy[1]
                            w:0,    //size[0]
                            h:0     //size[1]
                        },
                        rotation: 0,
                        rotated: false, //rotate
                        trimmed: true,
                        spriteSourceSize: {
                            x: 0,   //offset[0]
                            y: 0,   //offset[1]
                            w: 0,   //size[0]
                            h: 0    //size[1]
                        },
                        sourceSize: {
                            w: 0,   //orig[0]
                            h: 0    //orig[1]
                        },
                        scale: {
                            x: 1,
                            y: 1
                        },
                        textureName: textureData.name
                    }

                    let spriteName = matchSpritesStringItem.match(/(?<name>^.+$)/mi).groups.name;
                    let testData = [...matchSpritesStringItem.matchAll(/^\s+(rotate|xy|size|index|offset|orig):\s*(.+)$/mig)];
                    let values = null;
                    testData.forEach((paramData)=>{
                        switch (paramData[1]) {
                            case 'rotate':
                                spriteData.rotated = paramData[2] === 'true';
                                spriteData.rotation = spriteData.rotated ? 90 : 0;
                                break;
                            case 'xy':
                                values = paramData[2].split(',');
                                spriteData.frame.x = +(values[0].trim());
                                spriteData.frame.y = +(values[1].trim());
                                break;
                            case 'orig':
                                values = paramData[2].split(',');
                                spriteData.sourceSize.w = +(values[0].trim());
                                spriteData.sourceSize.h = +(values[1].trim());
                                break;
                            case 'size':
                                values = paramData[2].split(',');
                                spriteData.frame.w = +(values[0].trim());
                                spriteData.frame.h = +(values[1].trim());
                                spriteData.spriteSourceSize.w = +(values[0].trim());
                                spriteData.spriteSourceSize.h = +(values[1].trim());
                                break;
                            case 'offset':
                                values = paramData[2].split(',');
                                spriteData.spriteSourceSize.x = +(values[0].trim());
                                spriteData.spriteSourceSize.y = +(values[1].trim());
                                break;
                        }
                    })
                    this._sprites[spriteName] = spriteData;
                });

                this._textures.push(textureData);
            });*/

            /*let regExp = new RegExp(/((^.+$\s)(^\s+((rotate|xy|size|index|offset|orig).+)\s?)+)/mig);
            let test = null;
            while(test = regExp.exec(this._data)) {
                console.log(test);
            }*/

            //console.log(this._sprites);
        }
    }

    _parseSrcData() {
        if (this._srcData) {
            this._type = this._srcData.type;
            let fileReader = new FileReader();
            fileReader.addEventListener('loadend', (event) => {
                this.data = event.target.result;
                this._ready = true;
                this.emit('loaded', this);
            }, false);
            fileReader.readAsText(this._srcData);
        }
    }
}
