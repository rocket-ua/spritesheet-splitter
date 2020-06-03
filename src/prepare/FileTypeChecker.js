import JSONHashResource from "../resources/resources/JSONHashResource";
import JSONArrayResource from "../resources/resources/JSONArrayResource";
import AtlasResource from "../resources/resources/AtlasResource";
import Phaser3Resource from "../resources/resources/Phaser3Resource";
import TextureResource from "../resources/resources/TextureResource";
import Godot3Resource from "../resources/resources/Godot3Resource";
import Panda2Resource from "../resources/resources/Panda2Resource";
import BitmapFontResource from "../resources/resources/BitmapFontResource";

export default new class FileTypeChecker {
    constructor() {
        this.patterns = [
            {pattern: /{[.\s]*"textures"[.\s]*:[.\s]*\[[.\s]*(\s|\S)*"frames":/mi, resourceClass: Phaser3Resource, type: 1},
            {pattern: /{[.\s]*"textures"[.\s]*:[.\s]*\[[.\s]*(\s|\S)*"sprites":/mi, resourceClass: Godot3Resource, type: 1},
            {pattern: /(^.+$)\s([.\s]*(size|format|filter|repeat):\s*(.+)\s)+/mi, resourceClass: AtlasResource, type: 1},
            {pattern: /{(\s|\S)*?(.+"(x|y|w|h|sx|sy|sw|sh)".+\s){8}/im, resourceClass: Panda2Resource, type: 1},
            {pattern: /{[.\s]*"frames"[.\s]*:[.\s]*{/mi, resourceClass: JSONHashResource, type: 1},
            {pattern: /{[.\s]*"frames"[.\s]*:[.\s]*\[/mi, resourceClass: JSONArrayResource, type: 1},
            {pattern: /<font>[\s\S]*?[\s\S]*?<info.+face/mi, resourceClass: BitmapFontResource, type: 1},
        ];
    }

    //[.\s]*"frames".+(\s|\S)*(.+"(x|y|w|h|sx|sy|sw|sh)":\s*(.+)\s)+},

    //(.+"(x|y|w|h|sx|sy|sw|sh)":\s*(.+)\s)+

    getBaseType(srcData) {
        return this.getSrcResourceType(srcData);
    }

    getSrcResourceType(data) {
        if (data.type && data.type !== '') {
            return data.type;
        } else if (data.name) {
            let index = data.name.lastIndexOf('.');
            return data.name.substring(index + 1).toLocaleLowerCase();
        }
        return '';
    }

    check(srcData) {
        return new Promise((resolve, reject) => {
            let baseType = this.getBaseType(srcData);
            switch (baseType) {
                case 'image/png':
                case 'image/jpg':
                case 'image/jpeg':
                    this.readTextureFile(srcData, resolve, reject);
                    break;
                default:
                    this.readDataFile(srcData, resolve, reject);
                    break;
            }
        });
    }

    readTextureFile(srcData, resolve, reject) {
        let fileReader = new FileReader();
        fileReader.onloadend = (event) => {
            resolve({
                typeData: {resourceClass: TextureResource, type: 2},
                srcData: event.target.result
            });
        };
        fileReader.readAsDataURL(srcData);
    }

    readDataFile(srcData, resolve, reject) {
        let fileReader = new FileReader();
        fileReader.onloadend = (event) => {
            let result = this.machWithPatterns(event.target.result);
            if (result) {
                resolve({
                    typeData: result,
                    srcData: event.target.result
                });
            } else {
                reject();
            }
        };
        fileReader.readAsText(srcData);
    }

    machWithPatterns(data) {
        return this.patterns.find((patternData) => {
            return data.search(patternData.pattern) !== -1;
        });
    }
}
