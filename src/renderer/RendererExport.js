import ResourceManager from "../resources/ResourcesManager";

export default new class RendererExport {
    constructor() {
        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d', {alpha: true});

        this.addListeners();
    }

    addListeners() {

    }

    /**
     * Отрисовать спрайт на канвасеб перевести в DataURL и вернуть это значение
     * @param spriteSheetName имя спрайтлиста из которого нужно вырезать спрайт
     * @param spriteName имя спрайта который нужно отрисовать
     * @returns {string} DataURL
     */
    drawSpriteToExport(spriteSheetName, spriteName) {
        this._context.resetTransform();
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.width);
        this.drawSprite(spriteSheetName, spriteName);
        return this._canvas.toDataURL('image/png');
    }

    /**
     * Отрисовать вырезанный спрайт на канвасе
     * @param spriteSheetName имя спрайтлиста из которого нужно вырезать спрайт
     * @param spriteName имя спрайта который нужно отрисовать
     */
    drawSprite(spriteSheetName, spriteName) {
        let resource = ResourceManager.getSpriteSheet(`${spriteSheetName}`);
        if (resource && resource.ready) {
            let spriteData = resource.getSpriteData(spriteName);
            let texture = resource.getTexture(spriteData.textureName);
            let drawData = this.calculateDrawData(texture.data, spriteData);

            //Поменять скейл и ротейт если нужно. Так же сделать сдвиг для компенсации ротейта если нужно
            this._context.scale(spriteData.scale.x, spriteData.scale.y);

            //Изменить размеры канваса под расмер спрайта
            this.correctCanvasSize(spriteData);

            this._context.translate(0, (spriteData.rotated ? spriteData.sourceSize.h : 0));
            this._context.rotate((Math.PI / 180) * (spriteData.rotated ? -90 : 0));

            //Отрисовать вырезать спрайт из спрайтлиста и отрисовать его на канвасе
            this._context.drawImage(
                drawData.image,
                drawData.sx,
                drawData.sy,
                drawData.sWidth,
                drawData.sHeight,
                drawData.dx,
                drawData.dy,
                drawData.dWidth,
                drawData.dHeight
            );
        }
    }

    /**
     * Формирование объекта из исходных данных о спрайте для дальнейнего испольовани при отрисовке спрайта на канвасе
     * При формаровании учитывается rotate и trim
     * @param image спрайтлист из которого нужно вырезать спрайтлист
     * @param spriteData данные о позиции спрайта на спрайтлисте
     * @returns {{sHeight: (*), image: *, dx: (*), sx: *, dy: (*), sy: *, dHeight: (*), sWidth: (*), dWidth: (*)}}
     */
    calculateDrawData(image, spriteData) {
        return {
            image: image,
            sx: spriteData.frame.x,
            sy: spriteData.frame.y,
            sWidth: spriteData.rotated ? spriteData.frame.h : spriteData.frame.w,
            sHeight: spriteData.rotated ? spriteData.frame.w : spriteData.frame.h,
            dx: spriteData.rotated ? spriteData.spriteSourceSize.y : spriteData.spriteSourceSize.x,
            dy: spriteData.rotated ? spriteData.spriteSourceSize.x : spriteData.spriteSourceSize.y,
            dWidth: spriteData.rotated ? spriteData.spriteSourceSize.h : spriteData.spriteSourceSize.w,
            dHeight: spriteData.rotated ? spriteData.spriteSourceSize.w : spriteData.spriteSourceSize.h,
        }
    }

    /**
     * Изменение расмера канваса под размер спрайта который будет экспортироваться
     * @param spriteData данные о позиции спрайта на спрайтлисте
     */
    correctCanvasSize(spriteData) {
        this._canvas.width = spriteData.sourceSize.w;
        this._canvas.height = spriteData.sourceSize.h;
    }
}
