// Errors

class OptionError extends Error {
    /**
     * Erro de opções.
     * @param {*} message 
     * @param {*} options 
     */
    constructor(message, options = undefined) {
        typeof options == "object" ? super(message, options) : super(message);
    }

    name = "OptionError";
}

class ContextError extends Error {
    constructor(message, options = undefined) {
        typeof options == "object" ? super(message, options) : super(message);
    }

    name = "ContextError";
}

class LogicalError extends Error {
    constructor(message, options = undefined) {
        typeof options == "object" ? super(message, options) : super(message);
    }

    name = "LogicalError";
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

class CatchProperty {
    static search(type, obj, property) {
        if (!this.#searchTypes.includes(type)) throw new OptionError("tipo de pesquisa inválida");
        if (typeof obj !== "object") throw new TypeError("impossível pesquisar fora de objeto");
        if (typeof property !== "string" && typeof property !== "symbol") throw new TypeError("nome de propriedade inválida");

        return Object.getOwnPropertyDescriptor(obj, property)[type];
    }

    static #searchTypes = [ "get", "set", "value", "writable", "enumerable", "configurable" ]
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
        OptionError,
        ContextError,
        LogicalError,
        ID,
        TypedMap,
        TypedSet,
        searchElement,
        CatchProperty,
        isValidHexColor
    }
}