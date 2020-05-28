export default class GlobalDispatcher {
    static get listeners() {
        if (!this._listeners) {
            this._listeners = [];
        }
        return this._listeners;
    }

    static get eventsStack() {
        if (!this._eventsStack) {
            this._eventsStack = [];
        }
        return this._eventsStack;
    }

    static set inProgress(value) {
        this._inProgress = value;
    }

    static get inProgress() {
        if (!this._inProgress) {
            this._inProgress = false;
        }
        return this._inProgress;
    }

    static add($event, $callback, $context, $priority) {
        let listener = {event: $event, callback: $callback, context: $context, priority: $priority || 1, once: false};
        this.addToListeners(listener);
    }

    static addOnce($event, $callback, $context, $priority) {
        let listener = {event: $event, callback: $callback, context: $context, priority: $priority || 1, once: true};
        this.addToListeners(listener);
    }

    static addToListeners($listener) {
        this.listeners.push($listener);
        this.listeners.sort(function (a, b) {
            return b.priority - a.priority;
        });
    }

    static dispatch($event, $params, $callback) {
        this.eventsStack.push({event: $event, params: $params, callback: $callback || null});
        if (!this.inProgress) {
            this.executeFromStack();
        }
    }

    static remove($event, $callback) {
        this.listeners.forEach((listener, index, array) => {
            if (listener.event === $event && listener.callback === $callback) {
                array.splice(index, 1);
            }
        });
    }

    static removeAll($event) {
        this.listeners.forEach((listener, index, array) => {
            if (listener.event === $event) {
                array.splice(index, 1);
            }
        });
    }

    static executeFromStack() {
        this.inProgress = true;
        let object = null;
        while (this.eventsStack.length > 0) {
            object = this.eventsStack.shift();
            this.execute(object.event, object.params, object.callback);
        }
        this.inProgress = false;
    }

    static execute($event, $params, $callback) {
        let param = null;
        this.listeners.forEach((listener, index, array) => {
            if (listener.event === $event) {
                param = {type: $event, params: $params, callback: $callback};
                if (listener.context) {
                    listener.callback.call(listener.context, param);
                } else {
                    listener.callback(param);
                }
                if (listener.once) {
                    array.splice(index, 1);
                }
            }
        });
    }

}