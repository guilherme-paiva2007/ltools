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
    if (typeof window == "undefined") throw new ContextError();
    if (typeof target !== "string" && !(target instanceof String)) throw new TypeError("target precisa ser do tipo string");
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
    module.exports.OptionError = OptionError;
    module.exports.ContextError = ContextError;
    module.exports.LogicalError = LogicalError;
    module.exports.searchElement = searchElement;
}