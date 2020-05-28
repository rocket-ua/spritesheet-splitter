import JSZip from "jszip";
import RendererExport from "../renderer/RendererExport";
import ResourcesManager from "../resources/ResourcesManager.js";

export default new class Exporter {
    constructor() {
        this._spriteSheetsData = {};
    }

    /**
     * Создать разделенные спрайты, создать массив и скачать его
     * @param spriteSheetName имя спрайтлиста для экспорта
     * @param sprites массив имен спрайтов для экспорта
     */
    exportImages(spriteSheetName, sprites) {
        //создание обекта с данными спрайтов для одного спрайтлиста
        if (!this._spriteSheetsData.hasOwnProperty(spriteSheetName)) {
            this._spriteSheetsData[spriteSheetName] = {};
        }

        //получить данные отрисованных спрайтов из спрайтлиста (по массиву имен)
        let spriteSheetData = this._spriteSheetsData[spriteSheetName];
        sprites.forEach((spriteName)=>{
            spriteSheetData[spriteName] = RendererExport.drawSpriteToExport(spriteSheetName, spriteName);
        });

        //создать архив
        let spriteSheet = ResourcesManager.getSpriteSheet(spriteSheetName)
        this._makeZip(spriteSheetData, spriteSheet.name);
    }

    /**
     * Создание архива из отрисованных спрайтов
     * @param spriteSheetData
     * @param spriteSheetName
     * @private
     */
    _makeZip(spriteSheetData, spriteSheetName) {
        let zip = new JSZip();
        for (let param in spriteSheetData) {
            if (spriteSheetData.hasOwnProperty(param)) {
                zip.file(param + '.png', this._formatURL(spriteSheetData[param]), {base64: true});
            }
        }
        zip.generateAsync({type: "base64"}).then(this._onZipGenerateComplete(spriteSheetName));
    }

    /**
     *
     * @param spriteSheetName
     * @returns {function(...[*]=)}
     * @private
     */
    _onZipGenerateComplete(spriteSheetName) {
        return (base64) => {
            let element = document.createElement('a');
            element.setAttribute('href', 'data:application/zip;base64,' + base64);
            element.setAttribute('download', spriteSheetName);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

    }

    /**
     *
     * @param dataURL
     * @returns {void|string|*}
     * @private
     */
    _formatURL(dataURL) {
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
}
