// Storage Management

if (typeof module !== "undefined") {
    const { TypedMap, OptionError } = require( "./script" );
}

class WebStorageManager {
    constructor(prefix, storage) {
        if (!String.testValidConversion(prefix)) throw new TypeError("prefixo com valor inválido para conversão em string");
        prefix = String(prefix);
        if (storage == "session") storage = window.sessionStorage;
        if (storage == "local") storage = window.localStorage;

        if (!prefix.length.isBetween(1, 50, true)) throw new RangeError("prefixo de tamanho inválido (entre 1 e 50)");
        if (!(storage instanceof Storage)) throw new TypeError("armazenamento não encontrado");

        this.#storage = storage;
        this.#prefix = prefix;
    }

    #prefix;
    #storage;
    #values = new TypedMap(WebStorageManager.#Data, String);
    #data_types = new TypedMap(String, String);

    get prefix() {
        return this.#prefix;
    }

    get storage() {
        return this.#storage;
    }

    key(key) {
        if (!String.testValidConversion(key)) throw new TypeError("chave inválida para conversão em string");
        return `${this.prefix}:${key}`;
    }

    unkey(key) {
        if (!String.testValidConversion(key)) throw new TypeError("chave inválida para conversão em string");
        key = String(key);
        let regexp = new RegExp(`${this.#prefix}:.+`);
        if (regexp.test(key)) {
            return key.slice((this.#prefix + ":").length);
        } else {
            return undefined;
        }
    }

    static #illegal_values = ["storage_data_types"];

    static #Data = class WebStorageManagerData {
        /**
         * 
         * @param {string} key
         * @param {any} value
         * @param {"string"|"number"|"boolean"|"json"|"raw"} type
         */
        constructor(key, value, type) {
            if (!String.testValidConversion(key)) throw new TypeError("chave inválida para conversão em string");
            key = String(key);
            const DataConstructor = WebStorageManager.#Data
            if (!DataConstructor.#dataTypes.includes(type)) throw new TypeError(`tipo de valor inválido (${DataConstructor.#dataTypes.join(', ')})`);

            let unmatchError = (type) => new TypeError(`valor inválido para ${type}`);

            this.set(value, type);

            this.#key = key;
        }

        #key;
        #value;
        #rawValue;
        #type;

        get key() {
            return this.#key;
        }

        get value() {
            return this.#value;
        }

        get rawValue() {
            return this.#rawValue;
        }

        set value(newValue) {
            this.set(newValue, this.#type);
        }

        get type() {
            return this.#type;
        }

        set(value, type) {
            switch (type) {
                case "boolean":
                    if (typeof value !== "boolean") throw unmatchError(type);
                    break;
                case "json":
                    if (typeof value !== "object" || value === null) throw unmatchError(type);
                    break;
                case "number":
                    if (typeof value !== "number") throw unmatchError(type);
                    break;
                case "string":
                    if (typeof value !== "string") throw unmatchError(type);
                    break;
            }

            if (type === "raw") {
                this.#value = String(value);
                this.#rawValue = String(value);
            } else {
                this.#value = value;
                this.#rawValue = JSON.stringify(value)
            }

            this.#type = type;
        }

        static #dataTypes = [ "string", "number", "boolean", "json", "raw" ];
    }

    get #dataTypesObject() {
        return JSON.stringify(Object.fromEntries(this.#data_types.entries()));
    }

    set(key, value, type = "raw") {
        if (WebStorageManager.#illegal_values.includes(key)) throw new TypeError("chave ilegal");
        if (!String.testValidConversion(key)) throw new TypeError("chave inválida para conversão em string");
        key = String(key);

        if (this.#values.has(key)) {
            const data = this.#values.get(key);
            data.set(value, type);
        } else {
            this.#values.set(key, new WebStorageManager.#Data(key, value, type));
        }

        const data = this.#values.get(key);
        let prefixKey = this.key(data.key);
        this.#storage.setItem(prefixKey, data.rawValue);
        this.#data_types.set(key, data.type);
        this.#storage.setItem(this.key('storage_data_types'), this.#dataTypesObject);
    }

    get(key) {
        if (this.#values.has(key)) {
            return this.#values.get(key).value;
        } else {
            return undefined;
        }
    }

    remove(key) {
        if (this.#values.has(key)) {
            this.#values.delete(key);
            this.#data_types.delete(key);
            let prefixKey = this.key(key);
            this.#storage.removeItem(prefixKey);
            this.#storage.setItem(this.key('storage_data_types'), this.#dataTypesObject);
        }
    }

    clear() {
        [...this.#values.keys()].forEach(key => {
            this.remove(key);
        });
    }

    *dataObjects() {
        for (const value of this.#values.values()) {
            yield {
                key: value.key,
                value: value.value,
                rawValue: value.rawValue,
                type: value.type
            };
        }
    }

    *values() {
        for (const value of this.#values.values()) {
            yield value.value;
        }
    }

    *keys() {
        for (const key of this.#values.keys()) {
            yield key;
        }
    }

    *entries(dataObjects = false) {
        dataObjects = Boolean(dataObjects);
        for (const [key, value] of this.#values.entries()) {
            if (dataObjects) {
                yield [
                    key,
                    {
                        key: value.key,
                        value: value.value,
                        rawValue: value.rawValue,
                        type: value.type
                    }
                ];
            } else {
                yield [
                    key,
                    value.value
                ];
            }
        }
    }

    *[Symbol.iterator]() {
        yield* this.entries(false);
    }

    #loaded = false;

    load() {
        if (this.#loaded) return;
        this.#loaded = true;

        let types = JSON.parse(this.#storage.getItem(this.key('storage_data_types')));
        if (!types) types = {};
        
        for (let i = 0; i < this.#storage.length; i++) {
            const key = this.#storage.key(i);
            const value = this.#storage.getItem(key);
            
            const unkey = this.unkey(key);
            const type = types[unkey];
            if (unkey) {
                if (WebStorageManager.#illegal_values.includes(unkey)) continue;
                if (type == undefined || type == "raw") {
                    this.set(unkey, value, type);
                } else {
                    this.set(unkey, JSON.parse(value), type);
                }
            }
        }
    }
}

// Visual Control

class PageTheme {}

// Interactive Elements

class DynamicInput {
    constructor(input, events = {}) {
        if (!(input instanceof HTMLElement)) throw new TypeError("é necessário utilizar um elemento HTML");
        if (typeof events !== "object" || events === null) throw new TypeError("eventos precisam estar armazenados num objeto <event, callback>");
        this.#input = input;

        DynamicInput.#validEvents.forEach(event => {
            if (events[event] == undefined) return;
            const eventCallback = events[event];
            if (typeof eventCallback !== "function") throw new TypeError("um evento precisa ser uma função");
            this.#events.set(event, eventCallback);
            this.#input.addEventListener(event, eventCallback);
        });
    }

    #input;
    #events = new TypedMap(Function, String);
    
    static #validEvents = [ "input", "change", "focus", "blur" ];
}

class DynamicSearch {
    constructor(searchLink, join = "?") {
        if (!String.testValidConversion(searchLink)) throw new TypeError("URL de pesquisa inválido para conversão em string");
        searchLink = String(searchLink);

        if (join !== "?" || join !== "&") throw new TypeError("junção pode ser apenas ? e &");

        this.#join = join;
        this.#link = searchLink;
    }

    #link;
    #join = "?";

    link(search = "") {
        if (!String.testValidConversion(search)) throw new TypeError("pesquisa inválida para conversão em string");
        search = encodeURI(String(search));

        return `${this.#link}${this.#join}search=${search}`;
    }

    async search(search, callback = (search) => {}) { {}
        const link = this.link(search);
        if (typeof callback !== "function") throw new TypeError("callback precisa ser uma função");
        
        search = await fetch(link).then(resp => resp.json());

        callback(search);
        return search;
    }
}

if (typeof module !== "undefined") {
    module.exports = {}
}