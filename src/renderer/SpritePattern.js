export default new class SpritePattern {
    constructor() {
        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d', {alpha: true});

        this.cellSize = {
            width: 15,
            height: 15
        }

        this._canvas.width = this.cellSize.width * 2;
        this._canvas.height = this.cellSize.height * 2;

        this.init();
    }

    init() {
        this._context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this._context.fillRect(0, 0, this.cellSize.width, this.cellSize.height);
        this._context.fillRect(this.cellSize.width, this.cellSize.height, this.cellSize.width, this.cellSize.height);
        this._context.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this._context.fillRect(this.cellSize.width, 0, this.cellSize.width, this.cellSize.height);
        this._context.fillRect(0, this.cellSize.height, this.cellSize.width, this.cellSize.height);
    }

    get canvas() {
        return this._canvas;
    }
}
