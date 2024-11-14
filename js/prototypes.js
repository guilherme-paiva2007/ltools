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
                throw new TypeError("target precisa ser um objeto de protótipo ou uma função construtora/classe.");
        }
    }

    #target

    #set({name, configs}, setstatic = false) {
        let target = this.#target;
        if (setstatic) target = this.#target.constructor;
        if (typeof name !== "string" && typeof name !== "symbol") throw new TypeError("name precisa ser do tipo string ou symbol.");
        if (typeof configs !== "object") throw new TypeError("config precisa ser um objeto.");
        Object.defineProperties(target, {
            [name]: configs
        });
    }

    unset(name) {
        if (!Object.getOwnPropertyDescriptor(this, name).configurable) throw new Error(`PrototypeManager #unset: a propriedade ${name} não é configurável.`);
        delete this.#target[name];
    }

    setMethod(name, { value = function() {}, enumerable = false, configurable = false, writable = false }, setstatic) {
        if (typeof value !== "function") throw new TypeError("value precisa ser uma função.");
        if (typeof enumerable !== "boolean") throw new TypeError("enumerable precisa ser do tipo boolean.");
        if (typeof configurable !== "boolean") throw new TypeError("configurable precisa ser do tipo boolean.");
        if (typeof writable !== "boolean") throw new TypeError("writable precisa ser do tipo boolean.");
        let configs = {
            value,
            enumerable,
            configurable,
            writable
        }
        this.#set({ name, configs }, setstatic);
        // configurable, enumerable, writable, value
    }

    setProperty(name, { value, enumerable = false, configurable = true, writable = true }, setstatic) {
        if (typeof enumerable !== "boolean") throw new TypeError("enumerable precisa ser do tipo boolean.");
        if (typeof configurable !== "boolean") throw new TypeError("configurable precisa ser do tipo boolean.");
        if (typeof writable !== "boolean") throw new TypeError("writable precisa ser do tipo boolean.");
        let configs = {
            value,
            enumerable,
            configurable,
            writable
        };
        this.#set({ name, configs }, setstatic);
    }

    setGetterSetter(name, { get = function() {}, set = function(value) {}, enumerable = false, configurable = false }, setstatic) {
        if (typeof get !== "function") throw new TypeError("get precisa ser uma função");
        if (typeof set !== "function") throw new TypeError("set precisa ser uma função");
        if (set.length == 0) throw new SyntaxError("set precisa ter um argumento.");
        if (typeof enumerable !== "boolean") throw new TypeError("enumerable precisa ser do tipo boolean.");
        if (typeof configurable !== "boolean") throw new TypeError("configurable precisa ser do tipo boolean.");
        let configs = {
            get,
            set,
            enumerable,
            configurable
        };
        this.#set({ name, configs }, setstatic);
    }
}

function setPrototypes() {    
    const StringManipulator = new PrototypeManager(String);
    const NumberManipulator = new PrototypeManager(Number);
    const ArrayManipulator = new PrototypeManager(Array);

    StringManipulator.setMethod('reverse', {
        value: function reverse() {
            return this.split('').reverse().join('');
        }
    })

    NumberManipulator.setGetterSetter('hex', {
        /**
         * Retorna o valor hexadecimal do número.
         * @returns {string}
         */
        get: function hex() {
            return this.toString(16);
        }
    });

    NumberManipulator.setGetterSetter('br', {
        get: function br() {
            let numArray = this.toFixed(2).split('.');
            let int = numArray[0].reverse();
            let dec = numArray[1];

            let newInt = "";
            for (let i = 0; i < int.length; i++) {
                let alg = int[i];
                if (i !== 0 && i % 3 == 0) newInt += '.'
                newInt += alg;
            }
            newInt = newInt.reverse();

            return `R\$${newInt},${dec}`;
        }
    })

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

    NumberManipulator.setMethod('isValidHex', {
        /**
         * Verifica se uma string é um número hexadecimal.
         * @param {string} num 
         */
        value: function isValidHex(num) {
            if (typeof num !== "string") throw new TypeError(`parâmetro num precisa ser do tipo string`);
            num = num.toLowerCase().trim();
            let valid = true;

            for (let char of num) {
                if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'].includes(char)) {
                    valid = false;
                    break;
                }
            }

            return valid;
        }
    }, true)
    
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