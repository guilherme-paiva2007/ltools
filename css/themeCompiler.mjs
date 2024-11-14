import fs from 'fs';
import { } from "../js/prototypes.js";
import { OptionError, LogicalError } from '../js/script.js';

class CSSSelector {
    constructor(selector, ...rules) {
        if (typeof selector !== "string") throw new TypeError("selector precisa ser uma string");

        this.selector = selector;
        this.addRules(...rules)
    }

    static Rule = class Rule {
        constructor(property, value) {
            this.property = String(property);
            this.value = String(value);
        }
        /** @type {string} */
        property;
        /** @type {string} */
        value;

        toString() {
            return `${this.property}: ${this.value};`;
        }
    }

    addRules(...rules) {
        rules.forEach(rule => {
            if (!(rule instanceof CSSSelector.Rule)) return;
            this.rules.push(rule);
        })
    }

    /** @type {string} */
    selector;
    /** @type {Rule[]} */
    rules = [];

    toString() {
        return `${this.selector} {${this.rules.join(' ')}}`;
    }
    print() { return this.toString() }
}

class Theme {
    /**
     * @param {string} name 
     * @param {string} base //VERIFICACAO DECOR + APLICACAO
     * @param {string} grey // VERIFICACAO DE COR + APLICACAO
     * @param {Theme} reverse
     */
    constructor(name, base, grey, reverse = undefined) {
        if (typeof name !== "string") throw new TypeError("name precisa ser do tipo string");
        Theme.list.forEach(theme => {
            if (name == theme.name) throw new Error("name já está presente na lista de temas");
        });
        
        Color.checkHexCode(base);
        this.base = base;
        Color.checkHexCode(grey);
        this.grey = grey;
        Color.list['grey'].appendCode({[name]: grey});

        this.filters = Color.getFilters(this.base);

        if(reverse !== undefined)  {
            if (!(reverse instanceof Theme)) throw new TypeError("reverse precisa ser uma instância de Theme");
            this.reverse = reverse;
        }
        this.name = name;

        Theme.list.push(this);
    }

    /** @type {string} */
    name;
    /** @type {string} */
    base;
    /** @type {string} */
    grey;
    /** @type {Theme} */
    reverse;
    /** @type {{}} */
    vars;
    /** @type {{}} */
    filters;

    /**
     * @param {Theme} reverse 
     */
    setReverse(reverse) {
        if (this.reverse !== undefined) throw new Error("reverse já foi definido");
        if (!(reverse instanceof Theme)) throw new TypeError("reverse precisa ser uma instância de Theme");
        if (this == reverse) throw new LogicalError("não é possível definir um tema como seu próprio oposto");
        this.reverse = reverse;
        this.vars = Color.getVars(this.base, this.reverse.base);
    }

    /** @type {Theme[]} */
    static list = [];
}

class Color {
    /**
     * @param {string} name 
     * @param {{}} codes 
     */
    constructor(name, codes) {
        if (typeof name !== "string") throw new TypeError("name precisa ser do tipo string");
        if (Color.#illegalNames.includes(name)) throw new OptionError("nome proibído inserido");
        Object.keys(Color.list).forEach(color => {
            if (name == color.name) throw new Error("name já está presente na lista de cores");
        });
        if (codes !== undefined) {
            if (typeof codes !== "object") throw new TypeError("codes precisa ser um objeto");
            Object.entries(codes).forEach((code, index) => {
                let name = code[0];
                let color = code[1];
                if (typeof color !== "string") throw new TypeError(`codes.${name} não é do tipo string`);
                if (color.replace('#', '').length !== 6) throw new RangeError(`codes.${name} não tem o tamanho correto de um código HexColor`);
                if (!Number.isValidHex(color.replace('#', ''))) throw new SyntaxError(`codes.${name} não tem a estrutura correta de um código HexColor`);
            })
            Object.assign(this.codes, codes);
        }
        this.name = name

        Color.list[this.name] = this;
    }

    static #illegalNames = ['base', 'code', 'codes', 'filter', 'filters', 'var', 'vars'];

    appendCode(codes) {
        if (typeof codes !== "object") throw new TypeError("codes precisa ser um objeto");
        Object.values(codes).forEach(code => {
            if (typeof code !== "string") throw new TypeError("codes só pode conter strings");
        });
        Object.assign(this.codes, codes)
    }

    name;
    codes = {};
    get vars() {
        let vars = {};
        Theme.list.forEach(theme => {
            if (this.codes[theme.name] == undefined) throw new ReferenceError(`código do tema ${theme.name} não foi encontrado para a cor ${this.name}`);
            vars[theme.name] = Color.getVars(this.codes[theme.name], theme.base)
        });
        return vars;
    }
    get filters() {
        let filters = {}
        Theme.list.forEach(theme => {
            if (this.codes[theme.name] == undefined) throw new ReferenceError(`código do tema ${theme.name} não foi encontrado para a cor ${this.name}`);

            filters[theme.name] = Color.getFilters(this.codes[theme.name])
        });
        return filters;
    }

    static Vars = {
        '0': [0.0, 2],
        '1': [4.0, 1],
        '2': [1.0, 1],
        '3': [1.5, 2],
        '4': [2.0, 2]
    }

    static Filters = {
        '1': "80",
        '2': "4D",
        '3': "CC"
    }

    static getVars(color1, color2) {
        this.checkHexCode(color1)
        this.checkHexCode(color2)
        let vars = {}

        Object.entries(Color.Vars).forEach(vardouble => {
            const index = vardouble[0];
            const weight = vardouble[1][0];
            const side = vardouble[1][1];

            vars[index] = Color.average([color1, color2], weight, side);
        });

        return vars;
    }

    static getFilters(color) {
        this.checkHexCode(color);
        let filters = {}

        Object.entries(Color.Filters).forEach(filterdouble => {
            const index = filterdouble[0];
            const filter = filterdouble[1];

            filters[index] = color + filter;
        });

        return filters
    }

    static average([color1, color2], weight, side) {
        let colors = [];
        [color1, color2].forEach((color, index) => {
            if (typeof color !== "string") throw new TypeError(`color${index + 1} precisa ser do tipo string`);
            if (color.replace('#', '').length !== 6) throw new RangeError(`color${index + 1} não tem o tamanho correto de um código HexColor`);
            if (!Number.isValidHex(color.replace('#', ''))) throw new SyntaxError(`color${index + 1} não tem a estrutura correta de um código HexColor`);
            colors[index] = color.replace('#', '');
        });
        if (typeof weight !== "number") throw new TypeError("weigth precisa ser do tipo number");
        if (typeof side !== "number") throw new TypeError("side precisa ser do tipo number");
        if (![1, 2].includes(side)) throw new OptionError("side só pode ser 1 ou 2");

        let red = [];
        let green = [];
        let blue = [];

        colors.forEach((color, index) => {
            red[index] = parseInt(color.slice(0, 2), 16);
            green[index] = parseInt(color.slice(2, 4), 16);
            blue[index] = parseInt(color.slice(4, 6), 16);
        });

        function avr(colorarr) {
            let case1 = Math.round( ((colorarr[0] * weight) + (colorarr[1])) / (1 + weight) );
            let case2 = Math.round( ((colorarr[0]) + (colorarr[1] * weight)) / (1 + weight) );
            
            if (side == 1) return case1.hex.padStart(2, 0).toUpperCase();
            if (side == 2) return case2.hex.padStart(2, 0).toUpperCase();
        }

        return `#${avr(red)}${avr(green)}${avr(blue)}`;
    }

    static list = {};

    static checkHexCode(hexcode) {
        hexcode = hexcode.replace('#', '');
        if (typeof hexcode !== "string") throw new TypeError("HexCode não é do tipo string");
        if (hexcode.length !== 6) throw new RangeError("HexCode não cumpre o tamanho correto");
        if (!Number.isValidHex(hexcode)) throw new SyntaxError("HexCode não cumpre a estrutura correta");
        return true;
    }

    static {
        new Color('grey');
    }
}

(async function() {
    const readJSON = new Promise((resolve, reject) => {
        fs.readFile('./css/themeCompiler.json', 'utf-8', (err, data) => {
            if (err) throw err;
            resolve(JSON.parse(data))
        });
    });

    /**
    * @type { {
    *      themes: [string, string, string][],
    *      colors: {}
    * } }
    */
    const json = await readJSON;

    json.themes.forEach(themesdouble => {
        const theme1 = new Theme(...themesdouble[0]);
        const theme2 = new Theme(...themesdouble[1]);

        theme1.setReverse(theme2)
        theme2.setReverse(theme1);
    });

    Object.entries(json.colors).forEach(colordouble => {
        const name = colordouble[0];
        const codes = colordouble[1];

        new Color(name, codes);
    });

    // Exportar para JSON.
    const themesJSON = {};

    Theme.list.forEach(theme => {
        const themeInfo = {};
        themesJSON[theme.name] = themeInfo;

        themeInfo.name = theme.name;
        themeInfo.reverse = theme.reverse.name;
        themeInfo.base = theme.base;
        themeInfo.vars = theme.vars;
        themeInfo.filters = theme.filters;
        themeInfo.colors = {};

        Object.entries(Color.list).forEach(colordouble => {
            const name = colordouble[0];
            const color = colordouble[1];

            themeInfo.colors[name] = {};
            themeInfo.colors[name].code = color.codes[theme.name];
            themeInfo.colors[name].vars = color.vars[theme.name];
            themeInfo.colors[name].filters = color.filters[theme.name];
        })
    });

    const writeJSON = new Promise((resolve, reject) => {
        fs.writeFile('./css/themes.json', JSON.stringify(themesJSON), 'utf-8', () => { resolve() })
    });

    await writeJSON;

    // compilar em CSS.............

    const root = new CSSSelector(':root');
    const root_themes = {};
    Object.keys(themesJSON).forEach(name => root_themes[name] = new CSSSelector(`:root.${name}Theme, .${name}Theme, .${name}Theme *`));
    const root_colors = {};
    Object.keys(Color.list).forEach(name => root_colors[name] = new CSSSelector(`:root.${name}Main, .${name}Main, .${name}Main *`));
    root_colors['base'] = new CSSSelector(':root.baseMain, .baseMain, .baseMain *');

    Object.values(Color.list).forEach(color => {
        const vars = color.vars;
        const filters = color.filters;

        Theme.list.forEach(theme => {
            let var_theme_rules = [];
            let filter_theme_rules = [];
    
            let var_rules = [];
            let var_reverse_rules = [];
            let base_var_rules = [];
            let filter_reverse_rules = [];
            let filter_rules = [];
            let base_filter_rules = [];

            let main_rules = [];
            let main_reverse_rules = [];
            let main_theme_rules = [];

            Object.entries(vars[theme.name]).forEach(vardouble => {
                const index = vardouble[0];
                const code = vardouble[1];
    
                if (index == 0) {
                    var_theme_rules.push(new CSSSelector.Rule(  `--${color.name}_${theme.name}`, code))                                         // --[color]_[theme]    -> ROOT
                    var_rules.push(new CSSSelector.Rule(        `--${color.name}`,               `var(--${color.name}_${theme.name})`))         // --[color]            -> ROOT_THEME
                    var_reverse_rules.push(new CSSSelector.Rule(`--${color.name}_reverse`,       `var(--${color.name}_${theme.reverse.name})`)) // --[color]_reverse    -> ROOT_THEME
                } else {
                    var_theme_rules.push(new CSSSelector.Rule(  `--${color.name}Var${index}_${theme.name}`, code))                                                    // --[color]Var[index]_[theme]  -> ROOT
                    var_rules.push(new CSSSelector.Rule(        `--${color.name}Var${index}`,               `var(--${color.name}Var${index}_${theme.name})`))         // --[color]Var[index]          -> ROOT_THEME
                    var_reverse_rules.push(new CSSSelector.Rule(`--${color.name}Var${index}_reverse`,       `var(--${color.name}Var${index}_${theme.reverse.name})`)) // --[color]Var[index]_reverse  -> ROOT_THEME
                }
            });

            Object.entries(theme.vars).forEach(vardouble => {
                const index = vardouble[0];
                const code = vardouble[1];

                if (index == 0) {
                    var_theme_rules.push(new CSSSelector.Rule(  `--${theme.name}`,  code))                              // --[base]   -> ROOT
                    var_rules.push(new CSSSelector.Rule(        `--base`,           `var(--${theme.name})`))            // --base     -> ROOT_THEME
                    var_reverse_rules.push(new CSSSelector.Rule(`--reverse`,        `var(--${theme.reverse.name})`))    // --reverse  -> ROOT_THEME
                } else {
                    var_theme_rules.push(new CSSSelector.Rule(  `--${theme.name}Var${index}`,  code))                              // --[base]Var[index]              -> ROOT
                    var_rules.push(new CSSSelector.Rule(        `--baseVar${index}`,           `var(--${theme.name}Var${index})`))            // --baseVar[index]     -> ROOT_THEME
                    var_reverse_rules.push(new CSSSelector.Rule(`--reverseVar${index}`,        `var(--${theme.reverse.name}Var${index})`))    // --reverseVar[index]  -> ROOT_THEME
                }
            });

            Object.entries(filters[theme.name]).forEach(filterdouble => {
                const index = filterdouble[0];
                const code = filterdouble[1];

                filter_theme_rules.push(new CSSSelector.Rule(   `--${color.name}Filter${index}_${theme.name}`,  code))                                                       // --[color]Filter[index]_[theme]  -> ROOT
                filter_rules.push(new CSSSelector.Rule(         `--${color.name}Filter${index}`,                `var(--${color.name}Filter${index}_${theme.name})`))         // --[color]Filter[index]          -> ROOT_THEME
                filter_reverse_rules.push(new CSSSelector.Rule( `--${color.name}Filter${index}_reverse`,        `var(--${color.name}Filter${index}_${theme.reverse.name})`)) // --[color]Filter[index]_reverse  -> ROOT_THEME
            });

            Object.entries(theme.filters).forEach(filterdouble => {
                const index = filterdouble[0];
                const code = filterdouble[1];

                filter_theme_rules.push(new CSSSelector.Rule(   `--${theme.name}Filter${index}_${theme.name}`,  code))                                                       // --[color]Filter[index]_[theme]  -> ROOT
                filter_rules.push(new CSSSelector.Rule(         `--${color.name}Filter${index}`,                `var(--${color.name}Filter${index}_${theme.name})`))         // --[color]Filter[index]          -> ROOT_THEME
                filter_reverse_rules.push(new CSSSelector.Rule( `--${color.name}Filter${index}_reverse`,        `var(--${color.name}Filter${index}_${theme.reverse.name})`)) // --[color]Filter[index]_reverse  -> ROOT_THEME
            })
        });



    });
})()