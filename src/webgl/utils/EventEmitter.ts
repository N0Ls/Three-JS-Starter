export default class EventEmitter {

    callbacks: any;

    constructor() {
        this.callbacks = {};
        this.callbacks.base = {};
    }

    on(_names, _callback, _order = 1) {
        if (!(this.callbacks[_names] instanceof Array))
            this.callbacks[_names] = [];

        if (!(this.callbacks[_names][_order] instanceof Array))
            this.callbacks[_names][_order] = [];

        this.callbacks[_names][_order].push(_callback);

        return this;
    }

    off(_name, _callback = null) {
        if (typeof _callback === "function") {
            const callbacks = this.callbacks[_name];

            for (const order in this.callbacks) {
                const index = callbacks[order][_name].indexOf(_callback);
                if (index !== -1) {
                    callbacks.splice(index, 1);
                }
            }
        }

        else {
            if (this.callbacks[_name] instanceof Array) {
                delete this.callbacks[_name];
            }
        }
        return this;
    }

    trigger(_name: string, _args: any[] = []) {
        if (this.callbacks[_name] instanceof Array) {
            for (const order in this.callbacks[_name]) {
                for (const _callbackFunction of this.callbacks[_name][order]) {
                    _callbackFunction.apply(this, _args);
                }
            }
        }
    }
}