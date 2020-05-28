import ResourceManager from "../resources/ResourcesManager";
import Exporter from "../export/Exporter"

export default class Renderer {
    constructor(canvas) {
        this._started = false;
        this._canvas = canvas;
        this._canvas.width = this._canvas.offsetWidth;
        this._canvas.height = this._canvas.offsetHeight;
        this._context = this._canvas.getContext("2d", {alpha: true});

        this.spritesOffset = {
            x: 20,
            y: 0
        }

        this.spritesPositions = {};

        this.addListeners();
        this.update = this.update.bind(this);
    }

    addListeners() {
        window.addEventListener('resize', (event) => {
            this._canvas.width = this._canvas.offsetWidth;
            this._canvas.height = this._canvas.offsetHeight;
        });
    }

    start() {
        this._started = true;
        this.update();
    }

    stop() {
        this._started = false;
    }

    /**
     * Обновить канвас
     */
    update() {
        if (!this._started) {
            return;
        }

        this._context.resetTransform();
        this._context.clearRect(0, 0, this._canvas.offsetWidth, this._canvas.offsetHeight);
        this._context.fillStyle = '#016eaa';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        //this._context.scale(0.5, 0.5);

        //this._context.translate(100, 100);

        this._context.save();
        this.draw();
        this._context.restore();
        window.requestAnimationFrame(this.update);
    }

    /**
     * Перерисовать сожержимое канваса
     * @param item
     */
    draw(item) {
        this._context.save();

        this.drawSpriteSheet('spriteSheet');

        //this.highlightSprites('spriteSheet', ['52', '44', '46']);
        //this.highlightSprites('spriteSheet', ['graphics/symbols/Symbol_9', 'graphics/symbols/Symbol_11_blur', 'graphics/decorations/fog', 'graphics/symbols/Symbol_6_blur', 'graphics/symbols/Symbol_5_blur']);
        //this.drawSprite('game-1', 'graphics/ui/bottom_UI_panel_back');

        this._context.restore();
    }

    calculateCanvasScale(spriteSheet) {
        let sizeData = { width:0, height:0 };
        spriteSheet.textures.forEach((texture)=>{
            sizeData.width += texture.width;
            sizeData.height += texture.height;
        });
        sizeData.width += (spriteSheet.textures.length - 1) * this.spritesOffset.x;
        sizeData.height += (spriteSheet.textures.length - 1) * this.spritesOffset.y;
        /*let scale = 1;
        if (sizeData.width > sizeData.height) {
            scale = this._canvas.width / sizeData.width;
        } else {
            scale = this._canvas.height / sizeData.height;
        }*/
        let scale = 1;
        if (this._canvas.width < (sizeData.width * scale)) {
            scale *= this._canvas.width / (sizeData.width * scale);
        }
        if (this._canvas.height < (sizeData.height * scale)) {
            scale *= this._canvas.height / (sizeData.height * scale);
        }
        this._context.scale(scale, scale);
    }

    /**
     * Отрисовать спрайтлист
     * @param spriteSheetName имя спрайтлиста который нужно отрисовать
     */
    drawSpriteSheet(spriteSheetName) {
        let spriteSheet = ResourceManager.getSpriteSheet(`${spriteSheetName}`);
        if (spriteSheet && spriteSheet.ready) {
            this.calculateCanvasScale(spriteSheet);

            let offsetX = 0;
            let offsetY = 0;

            spriteSheet.textures.forEach((texture) => {
                this._context.save();
                this._context.translate(offsetX, offsetY);
                this.drawSpriteBackground(texture.width, texture.height);
                this._context.drawImage(texture.data, 0, 0);
                this.spritesPositions[texture.name] = {
                    x: offsetX,
                    y: offsetY
                }
                offsetX += texture.data.width + this.spritesOffset.x;
                offsetY += this.spritesOffset.y
                this._context.restore();
            })
            //this._context.drawImage(resource.texture.data, 0, 0);
        }
    }

    drawSpriteBackground(width, height) {
        this._context.strokeStyle = 'rgba(0, 0, 0, 1)';
        this._context.fillStyle = 'rgb(180,180,180)';
        this._context.fillRect(0, 0, width, height);
        this._context.strokeRect(0, 0, width, height);
    }

    /**
     * Отрисовать поверх спрайтлиста области занимаемые спрайтами
     * @param spriteSheetName имя спрайтлиста для которого нужно отрисовать области спрайтов
     * @param spritesNames массив имен спрайтов облисти которых нужно отрисовать
     */
    highlightSprites(spriteSheetName, spritesNames) {
        let spriteSheet = ResourceManager.getSpriteSheet(`${spriteSheetName}`);
        if (spriteSheet && spriteSheet.ready) {
            spritesNames.forEach((spriteName) => {
                let spriteData = spriteSheet.getSpriteData(spriteName);
                if(!spriteData) {
                    return;
                }
                this._context.save();
                this._context.translate(this.spritesPositions[spriteData.textureName].x, this.spritesPositions[spriteData.textureName].y);
                let drawData = this.calculateDrawData(null, spriteData);
                this._context.strokeStyle = 'rgba(0, 255, 0, 1)';
                this._context.fillStyle = 'rgba(0, 255, 0, 0.3)';
                this._context.fillRect(
                    drawData.sx,
                    drawData.sy,
                    drawData.sWidth,
                    drawData.sHeight
                );
                this._context.strokeRect(drawData.sx, drawData.sy, drawData.sWidth, drawData.sHeight);
                /*this._context.moveTo(drawData.sx, drawData.sy);
                this._context.lineTo(drawData.sx + drawData.sWidth, drawData.sy + drawData.sHeight);
                this._context.moveTo(drawData.sx + drawData.sWidth, drawData.sy);
                this._context.lineTo(drawData.sx, drawData.sy + drawData.sHeight);
                this._context.stroke();*/
                this._context.restore();
            });
        }
    }

    /**
     * Отрисовать вырезанный спрайт на канвасе
     * @param spriteSheetName имя спрайтлиста из которого нужно вырезать спрайт
     * @param spriteName имя спрайта который нужно отрисовать
     */
    drawSprite(spriteSheetName, spriteName) {
        let spriteSheet = ResourceManager.getSpriteSheet(`${spriteSheetName}`);
        if (spriteSheet && spriteSheet.ready) {
            let spriteData = spriteSheet.getSpriteData(spriteName);
            let texture = spriteSheet.getTexture(spriteData.textureName);
            let drawData = this.calculateDrawData(texture.data, spriteData);

            //Поменять скейл и ротейт если нужно. Так же сделать сдвиг для компенсации ротейта если нужно
            this._context.scale(spriteData.scale.x, spriteData.scale.y);
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

    get started() {
        return this._started;
    }
}
