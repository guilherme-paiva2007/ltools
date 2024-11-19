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
                    if (!(value instanceof this.#type)) return false;
                } else {
                    if (value.constructor !== this.#type) return false;
                }
                break;
            case "key":
                if (this.#includeAllInstances) {
                    if (!(value instanceof this.#keytype)) return false;
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

if (typeof module !== "undefined") {
    module.exports = {
        OptionError,
        ContextError,
        LogicalError,
        TypedMap,
        TypedSet,
        searchElement
    }
}