class PrototypeManager {
    constructor(target) {
        switch (typeof target) {
            case "object":
                this.#target = target;
                break;
            case "function":
                this.#target = target.prototype;
                break;
            default:
                throw new TypeError("PrototypeManager constructor: target precisa ser um objeto de protótipo ou uma função construtora/classe.");
        }
    }

    #target

    #set({name, configs}) {
        if (typeof name !== "string" && typeof name !== "symbol") throw new TypeError("PrototypeManager #set: name precisa ser do tipo string ou symbol.");
        if (typeof configs !== "object") throw new TypeError("PrototypeManager #set: config precisa ser um objeto.");
        Object.defineProperties(this, {
            [name]: configs
        });
    }

    unset(name) {
        if (!Object.getOwnPropertyDescriptor(this, name).configurable) throw new Error(`PrototypeManager #unset: a propriedade ${name} não é configurável.`);
        delete this[name];
    }

    setMethod(name, { value = function() {}, enumerable = false, configurable = false, writable = false }) {
        if (typeof value !== "function") throw new TypeError("PrototypeManager setMethod: value precisa ser uma função.");
        if (typeof enumerable !== "boolean") throw new TypeError("PrototypeManager setMethod: enumerable precisa ser do tipo boolean.");
        if (typeof configurable !== "boolean") throw new TypeError("PrototypeManager setMethod: configurable precisa ser do tipo boolean.");
        if (typeof writable !== "boolean") throw new TypeError("PrototypeManager setMethod: writable precisa ser do tipo boolean.");
        let configs = {
            value,
            enumerable,
            configurable,
            writable
        }
        this.#set({ name, configs });
        // configurable, enumerable, writable, value
    }

    setProperty(name, { value, enumerable = true, configurable = true, writable = true }) {
        if (typeof enumerable !== "boolean") throw new TypeError("PrototypeManager setProperty: enumerable precisa ser do tipo boolean.");
        if (typeof configurable !== "boolean") throw new TypeError("PrototypeManager setProperty: configurable precisa ser do tipo boolean.");
        if (typeof writable !== "boolean") throw new TypeError("PrototypeManager setProperty: writable precisa ser do tipo boolean.");
        let configs = {
            value,
            enumerable,
            configurable,
            writable
        };
        this.#set({ name, configs });
    }

    setGetterSetter(name, { get = function() {}, set = function(value) {}, enumerable = true, configurable = false }) {
        if (typeof get !== "function") throw new TypeError("PrototypeManager setGetterSetter: get precisa ser uma função");
        if (typeof set !== "function") throw new TypeError("PrototypeManager setGetterSetter: set precisa ser uma função");
        if (set.length == 0) throw new SyntaxError("PrototypeManager setGetterSetter: set precisa ter um argumento.");
        if (typeof enumerable !== "boolean") throw new TypeError("PrototypeManager setGetterSetter: enumerable precisa ser do tipo boolean.");
        if (typeof configurable !== "boolean") throw new TypeError("PrototypeManager setGetterSetter: configurable precisa ser do tipo boolean.");
        let configs = {
            get,
            set,
            enumerable,
            configurable
        };
        this.#set({ name, configs });
    }

    static Collection = class Collection {
        /**
         * @param  {...PrototypeManager} managers 
         */
        constructor(...managers) {
            this.add(...managers);
        }

        #collection = new Set();

        /**
         * @param  {...PrototypeManager} managers 
         */
        add(...managers) {
            managers.forEach(manager => {
                if (!(manager instanceof PrototypeManager)) throw new TypeError("PrototypeManager.Collection add: manager precisa ser uma instância de PrototypeManager.");
                this.#collection.add(manager);
            });
        }

        /**
         * @param  {...PrototypeManager} managers 
         */
        remove(...managers) {
            managers.forEach(manager => {
                if (!(manager instanceof PrototypeManager)) throw new TypeError("PrototypeManager.Collection remove: manager precisa ser uma instância de PrototypeManager.");
                if (this.#collection.has(manager)) this.#collection.delete(manager);
            });
        }
    }
}

const basicPrototypes = new PrototypeManager.Collection();
const webPrototypes = new PrototypeManager.Collection();

const StringManipulator = new PrototypeManager(String);
const NumberManipulator = new PrototypeManager(Number);
const ArrayManipulator = new PrototypeManager(Array);
if (typeof window !== "undefined") {
    const HTMLElementManipulator = new PrototypeManager(HTMLElement);
    const HTMLCollectionManipulator = new PrototypeManager(HTMLCollection);

    webPrototypes.add(HTMLElementManipulator, HTMLCollectionManipulator);
}

basicPrototypes.add(StringManipulator, NumberManipulator, ArrayManipulator);