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
        Object.defineProperties(this.#target, {
            [name]: configs
        });
    }

    unset(name) {
        if (!Object.getOwnPropertyDescriptor(this, name).configurable) throw new Error(`PrototypeManager #unset: a propriedade ${name} não é configurável.`);
        delete this.#target[name];
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

    setProperty(name, { value, enumerable = false, configurable = true, writable = true }) {
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

    setGetterSetter(name, { get = function() {}, set = function(value) {}, enumerable = false, configurable = false }) {
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
}

function setPrototypes() {    
    const StringManipulator = new PrototypeManager(String);
    const NumberManipulator = new PrototypeManager(Number);
    const ArrayManipulator = new PrototypeManager(Array);

    NumberManipulator.setGetterSetter('hex', {
        /**
         * Retorna o valor hexadecimal do número.
         * @returns {string}
         */
        get: function hex() {
            return this.toString(16);
        }
    });

    NumberManipulator.setMethod('isBetween', {
        /**
         * Verifica se o número está dentro de um intervalo.
         * @param {number} min Valor mínimo a ser verificado.
         * @param {number} max Valor máximo a ser verificado.
         * @param {boolean} includeEquals Inclue valores iguais aos mínimos e máximos.
         * @returns {boolean}
         */
        value: function isBetween(min, max = Infinity, includeEquals = false) {
            if (typeof min !== "number" && !(min instanceof Number)) throw new TypeError(`parâmetro min precisa ser do tipo number`);
            if (typeof max !== "number" && !(max instanceof Number)) throw new TypeError(`parâmetro max precisa ser do tipo number`);
            if (typeof includeEquals !== "boolean" && !(includeEquals instanceof Boolean)) throw new TypeError(`parâmetro includeEquals precisa ser do tipo boolean`);

            if (
                (this > min || (includeEquals && this == min)) &&
                (this < max || (includeEquals && this == max))
            ) return true;

            return false
        }
    });
    
    if (typeof window !== "undefined") {
        const HTMLElementManipulator = new PrototypeManager(HTMLElement);
        const HTMLCollectionManipulator = new PrototypeManager(HTMLCollection);
    }
}

setPrototypes()

if (typeof module !== "undefined") {
    module.exports.PrototypeManager = PrototypeManager;
    module.exports.setPrototypes = setPrototypes;
}