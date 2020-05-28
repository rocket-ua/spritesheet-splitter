export default class EventEmitter {
    constructor() {
        this._callbacks = [];
    }

    emit(type, data) {
        let callbacks = this._callbacks.filter((callback) => {
            return callback.type === type;
        });
        callbacks.forEach((callback) => {
            if (callback.callback) {
               if (callback.context) {
                   callback.callback.call(callback.context, data);
               } else {
                   callback.callback(callback.context, data);
               }
            }
        })
    }

    on(type, callback, context) {
        let event = {
            type: type,
            callback: callback,
            context: context,
            once: false
        }
        this._callbacks.push(event);
    }

    once(type, callback, context) {
        let event = {
            type: type,
            callback: callback,
            context: context,
            once: true
        }
        this._callbacks.push(event);
    }
}
