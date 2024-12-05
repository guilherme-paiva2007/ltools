// Control

class Property {
    constructor(object, property, ...manipulators) {
        if (typeof property !== "string" && typeof property !== "symbol") throw new TypeError("nome de propriedade inválida");
        if (typeof object !== "object" && typeof object !== "function") throw new TypeError("impossível manipular fora de objeto");

        Property.set(object, property, ...manipulators);

        this.object = object;
        this.property = property;

        const properties = Object.getOwnPropertyDescriptor(object, property);
        this.get = properties.get;
        this.set = properties.set;
        this.value = properties.value;
        this.writable = properties.writable;
        this.enumerable = properties.enumerable;
        this.configurable = properties.configurable;
    }

    static #validateObjProperty(object, property) {
        if (typeof property !== "string" && typeof property !== "symbol") throw new TypeError("nome de propriedade inválida");
        if (typeof object !== "object" && typeof object !== "function") throw new TypeError("impossível manipular fora de objeto");
    }

    static freeze(object, property) {
        this.#validateObjProperty(object, property);

        let prop = Object.getOwnPropertyDescriptor(object, property);
        if (prop === undefined) throw new TypeError("propriedade inexistente");

        prop.writable = false;
        Object.defineProperty(object, property, prop);
    }

    static unfreeze(object, property) {
        this.#validateObjProperty(object, property);

        let prop = Object.getOwnPropertyDescriptor(object, property);
        if (prop === undefined) throw new TypeError("propriedade inexistente");

        prop.writable = true;
        Object.defineProperty(object, property, prop);
    }

    static hide(object, property) {
        this.#validateObjProperty(object, property);

        let prop = Object.getOwnPropertyDescriptor(object, property);
        if (prop === undefined) throw new TypeError("propriedade inexistente");

        prop.enumerable = false;
        Object.defineProperty(object, property, prop);
    }

    static show(object, property) {
        this.#validateObjProperty(object, property);

        let prop = Object.getOwnPropertyDescriptor(object, property);
        if (prop === undefined) throw new TypeError("propriedade inexistente");

        prop.enumerable = true;
        Object.defineProperty(object, property, prop);
    }

    static lock(object, property) {
        this.#validateObjProperty(object, property);

        let prop = Object.getOwnPropertyDescriptor(object, property);
        if (prop === undefined) throw new TypeError("propriedade inexistente");

        prop.configurable = false;
        Object.defineProperty(object, property, prop);
    }

    static set(object, property, ...manipulators) {
        this.#validateObjProperty(object, property);

        if (manipulators.includes('lock')) {
            let newmanipulators = [];
            manipulators.forEach(manipulator => {
                if (manipulator === "lock") return;
                newmanipulators.push(manipulator);
            });
            newmanipulators.push('lock');
            manipulators = newmanipulators;
        }

        manipulators.forEach(manipulator => {
            if (!Property.#methods.includes(manipulator)) throw new OptionError("método de manipulação inválido");

            this[manipulator](object, property);
        });
    }

    static catch(object, property, search = "value") {
        if (typeof property !== "string" && typeof property !== "symbol") throw new TypeError("nome de propriedade inválida");
        if (object === null || object === undefined) throw new TypeError("objeto de busca inválido");
        if (!this.#attributes.includes(search)) throw new OptionError("atributo de busca inválido");

        let properties = Object.getOwnPropertyDescriptor(object, property);
        if (!properties) properties = {};

        return properties[search];
    }

    static #methods = [ "freeze", "unfreeze", "hide", "show", "lock" ];
    static #attributes = [ "get", "set", "value", "writable", "enumerable", "configurable" ];
}

// Errors

class OptionError extends Error {
    constructor(message, options = undefined) {
        typeof options == "object" ? super(message, options) : super(message);
    }

    static {
        const prototype = this.prototype
        prototype.name = "OptionError";
        Property.set(prototype, 'name', "hide", "freeze", "lock");
    }
}

class ContextError extends Error {
    constructor(message, options = undefined) {
        typeof options == "object" ? super(message, options) : super(message);
    }

    static {
        this.prototype.name = "ContextError";
    }
}

class LogicalError extends Error {
    constructor(message, options = undefined) {
        typeof options == "object" ? super(message, options) : super(message);
    }

    static {
        this.prototype.name = "LogicalError";
    }
}

// Value Types

class ID {
    /**
     * Identificar único.
     * @param {string} type 
     * @param {{
     *      description: string,
     *      symbol: symbol
     * }} configs 
     */
    constructor(type, configs = {}, ...params) {
        if (!ID.#types.includes(type)) throw new OptionError("tipo de ID inexistente.");
        if (configs !== undefined) {
            if (typeof configs !== "object" || configs === null) throw new TypeError("configurações precisam estar em um objeto");
            typeof configs.description == "string" ? this.#description = configs.description : this.#description = "";
            typeof configs.symbol == "symbol" ? this.#symbol = configs.symbol : this.#symbol = Symbol();
        } else {
            this.#symbol = Symbol();
            this.#description = "";
        }

        this.#id = ID[type](...params)
    }

    #id;
    #symbol;
    #description;

    get id() {
        return this.#id;
    }

    get symbol() {
        return this.#symbol;
    }

    get description() {
        return this.#description;
    }

    static #types = [
        this.date.name
    ];

    /**
     * @param {Date} date 
     * @returns {string}
     */
    static date(date) {
        if (!(date instanceof Date)) date = new Date(date);
        if (isNaN(date.valueOf())) date = new Date();

        let fillNLength = (value, length = 2, fill = '0') => {
            return value.toString().padStart(length, fill).slice(0, length);
        }

        return [
            [
                fillNLength(date.getFullYear(), 4),
                fillNLength(date.getMonth() + 1),
                fillNLength(date.getDate())
            ],
            [
                fillNLength(date.getHours()),
                fillNLength(date.getMinutes()),
                fillNLength(date.getSeconds()),
                fillNLength(date.getMilliseconds(), 3)
            ]
        ].map(subarr => subarr.join('.')).join('-')
    }
}

// Collections

class TypedMap extends Map {
    /**
     * Cria um Map limitado a tipo específico.
     * @param {Function} type 
     * @param {Function|undefined} keytype 
     * @param {boolean} includeAllInstances 
     */
    constructor(type, keytype = undefined, includeAllInstances = false) {
        super();
        if (typeof type !== "function") throw new TypeError("type precisa ser uma função construtora");
        this.#type = type;
        if (typeof keytype !== "function" && keytype !== undefined) throw new TypeError("keytype precisa ser uma função construtora");
        this.#keytype = keytype;
        this.#includeAllInstances = Boolean(includeAllInstances);
    }

    /** @type {Function} */
    #type;
    #keytype = undefined;
    #includeAllInstances = false;

    /**
     * Verifica se um valor é válido para ser inserido na coleção.
     * @param {any} value 
     * @param {"key"|"value"} type 
     * @returns {boolean}
     */
    checkType(value, type) {
        if (!["key", "value"].includes(type)) type = "value";
        if (type == "key" && this.#keytype == undefined) return true;
        if (value == undefined || value == null) return false;
        switch (type) {
            case "value":
                if (this.#includeAllInstances) {
                    if (!(value instanceof this.#type) && value.constructor !== this.#type) return false;
                } else {
                    if (value.constructor !== this.#type) return false;
                }
                break;
            case "key":
                if (this.#includeAllInstances) {
                    if (!(value instanceof this.#keytype) && value.constructor !== this.#keytype) return false;
                } else {
                    if (value.constructor !== this.#keytype) return false;
                }
                break;
        }
        return true;
    }

    set(key, value) {
        if (!this.checkType(key, "key")) throw new TypeError(`chave inválida para coleção Map de tipo ${this.#type.name}`);
        if (!this.checkType(value, "value")) throw new TypeError(`valor inválido para coleção Map de tipo ${this.#type.name}`);

        super.set(key, value);
    }
}

class TypedSet extends Set {
    /**
     * Cria um Set limitado a tipo específico.
     * @param {Function} type 
     */
    constructor(type, includeAllInstances = false) {
        super();
        if (typeof type !== "function") throw new TypeError("type precisa ser uma função construtora");
        this.#type = type;
        this.#includeAllInstances = Boolean(includeAllInstances);
    }

    /** @type {Function} */
    #type;
    #includeAllInstances = false;
    
    checkType(value) {
        if (value == undefined || value == null) return false;
        if (this.#includeAllInstances) {
            if (!(value instanceof this.#type)) return false;
        } else {
            if (value.constructor !== this.#type) return false;
        }
        return true;
    }

    add(value) {
        if (!this.checkType(value)) throw new TypeError(`valor inválido para coleção Set de tipo ${this.#type.name}`);

        super.add(value);
    }
}

// Searchs

/**
 * Procura por um elemento.
 * @param {string} target Alvo de busca.
 * @param {"id"|"class"|"tag"|"name"|"query"|"queryAll"} method Meio de busca.
 * @returns {HTMLElement|HTMLCollection|NodeList|null}
 * @throws {TypeError} Caso o alvo não seja uma string.
 * @throws {OptionError} Caso selecione métodos inválidos.
 */
function searchElement(target, method = 'id') {
    if (typeof window == "undefined") throw new ContextError("não é possível utilizar este método fora de um ambiente navegador");
    target = String(target);
    if (!['id', 'class', 'tag', 'name', 'query', 'queryAll'].includes(method)) throw new OptionError("method precisa ser \"id\", \"class\", \"tag\", \"name\", \"query\" ou \"queryAll\"");

    switch (method) {
        case "id":
            return document.getElementById(target);
        case "class":
            return document.getElementsByClassName(target);
        case "tag":
            return document.getElementsByTagName(target);
        case "name":
            return document.getElementsByName(target);
        case "query":
            return document.querySelector(target);
        case "queryAll":
            return document.querySelectorAll(target);
    }
}

// Checks

function isValidHexColor(colorStr = "") {
    if (!String.testValidConversion(colorStr)) return false;
    colorStr = String(colorStr);
    colorStr = colorStr.replace("#", "");
    if (!Number.isValidHex(colorStr)) return false;
    if (colorStr.length < 6 || colorStr.length > 8) return false;

    return true;
}

if (typeof module !== "undefined") {
    module.exports = {
        Property,
        OptionError,
        ContextError,
        LogicalError,
        ID,
        TypedMap,
        TypedSet,
        searchElement,
        isValidHexColor
    }
}