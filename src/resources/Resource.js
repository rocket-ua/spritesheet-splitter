import EventEmitter from "../event/EventEmitter";

export default class Resource extends EventEmitter {
    constructor(name, srcData, data) {
        super();
        this._name = name || '';
        this._srcData = {};
        this._data = {};
        this._type = null;

        this._promise = new Promise((resolve, reject) => {
            this.on('loaded', resolve);
        });
        this._ready = false;

        this.srcData = srcData || null;
        this.data = data || null;
    }

    _parseSrcData() {

    }

    _parseData() {

    }

    get name() {
        return this._name
    }

    get srcData() {
        return this._srcData;
    }

    set srcData(value) {
        this._srcData = value;
        this._parseSrcData();
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this._parseData();
    }

    get type() {
        return this._type;
    }

    get ready() {
        return this._ready;
    }

    get promise() {
        return this._promise;
    }
}
