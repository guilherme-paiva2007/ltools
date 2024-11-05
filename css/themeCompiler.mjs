// alpha (0.0-1.0) -> hex (00-ff): Math.floor(alpha * 256).toString(16)

String.prototype.isIn = function isIn(list) {
    let isIn = false;
    list.forEach(element => {
        if (this == element) isIn = true;
    })
    return isIn;
}

String.prototype.fillUntil = function fillUntil(filler, lengthNeeded, pos = "after") {
    if (typeof lengthNeeded !== "number") lengthNeeded = 0;
    if (typeof pos !== "string") return;
    if (pos !== "after" && pos !== "before") pos = "after"
    if (filler.length > 1) filler = filler[0];

    let array = this.split('');
    for (let i = 0; i < this.length; i++) {
        array[i] = this[i];
    }

    while (array.length < lengthNeeded) {
        if (pos == "after") {
            array.push(filler)
        }
        if (pos == "before") {
            array.unshift(filler)
        }
    }
    return array.join('')
}

Array.prototype.remove = function remove(...searchIndex) {
    let newArray = [];
    for (let index in this) {
        if (!searchIndex.includes(parseInt(index))) newArray.push(this[index]);
    }
    return newArray;
}

import fs from 'fs';
let themesJSON = undefined;

class Colors {
    constructor(mainColor, neutralColor, avarages = [ [4, 1], [1, 1], [1.5, 2], [2, 2] ]) {
        if (typeof mainColor !== "string" || mainColor == "") mainColor = "#000000";
        if (mainColor.replace('#', '').length !== 6) mainColor = mainColor.slice(0, 6);
        mainColor = mainColor.replace('#', '');
        mainColor.split('').forEach(colorSection => {
            if (!colorSection.isIn(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'])) mainColor = "000000";
        })
        this.mainColor = mainColor;

        if (typeof neutralColor !== "string" || neutralColor == "") neutralColor = "#ffffff";
        if (neutralColor.replace('#', '').length !== 6) neutralColor = neutralColor.slice(0, 6);
        neutralColor = neutralColor.replace('#', '');
        neutralColor.split('').forEach(colorSection => {
            if (!colorSection.isIn(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'])) neutralColor = "ffffff";
        })
        this.neutralColor = neutralColor;

        this[0] = '#' + this.mainColor;
        this[1] = Colors.avarage(this.mainColor, this.neutralColor, ...avarages[0]);
        this[2] = Colors.avarage(this.mainColor, this.neutralColor, ...avarages[1]);
        this[3] = Colors.avarage(this.mainColor, this.neutralColor, ...avarages[2]);
        this[4] = Colors.avarage(this.mainColor, this.neutralColor, ...avarages[3]);

        Object.defineProperty(this, 'mainColor', { enumerable: false })
        Object.defineProperty(this, 'neutralColor', { enumerable: false })
    }

    static avarage(color1, color2, weight = 1, side = 1) {
        if (typeof color1 !== "string" || color1.replace('#', '').length !== 6) return "#000000";
        if (typeof color2 !== "string" || color2.replace('#', '').length !== 6) return "#000000";
        if (typeof weight !== "number") weight = 1;
        if (side == "color1") side = 1;
        if (side == "color2") side = 2;
        if (typeof side !== "number") side = 1;


        let red1 = parseInt(color1.slice(0, 2), 16);
        let red2 = parseInt(color2.slice(0, 2), 16);
        let green1 = parseInt(color1.slice(2, 4), 16);
        let green2 = parseInt(color2.slice(2, 4), 16);
        let blue1 = parseInt(color1.slice(4, 6), 16);
        let blue2 = parseInt(color2.slice(4, 6), 16);

        let newRed, newGreen, newBlue;
        if (side == 1) {
            newRed = Math.floor((red1 * weight + red2) / (1 + weight));
            newGreen = Math.floor((green1 * weight + green2) / (1 + weight));
            newBlue = Math.floor((blue1 * weight + blue2) / (1 + weight));
        }
        if (side == 2) {
            newRed = Math.floor((red1 + red2 * weight) / (1 + weight));
            newGreen = Math.floor((green1 + green2 * weight) / (1 + weight));
            newBlue = Math.floor((blue1 + blue2 * weight) / (1 + weight));
        }

        return '#' + [newRed.toString(16), newGreen.toString(16), newBlue.toString(16)].map(sec => sec.fillUntil('0', 2, 'before')).join('').toUpperCase();
    }
}

class Theme {
    constructor(themeName, neutralColor) {
        this.name = themeName,
        this.colors = {};
        this.neutralColor = neutralColor;
        this.reverseTheme = undefined;

        this.colors.base = {};
        this.colors.base.code = this.neutralColor;
        this.colors.base.filters = [ this.neutralColor + "80", this.neutralColor + "4D", this.neutralColor + "CC" ];

        this.colors.base.grey = {};
        this.colors.base.grey.code = "#7C7C7C";
        this.colors.base.grey.filters = [ "#7C7C7C80", "#7C7C7C4D", "#7C7C7CCC" ];
    }
    toString() {
        return this.name
    }
    addColor(colorName, color) {
        let colors = new Colors(color, this.neutralColor);
        this.colors[colorName] = {}
        this.colors[colorName].vars = [];
        this.colors[colorName].vars = [...Object.values(colors)];

        this.colors[colorName].filters = []
        this.colors[colorName].filters = [ color + "80", color + "4D", color + "CC" ]
    }
    setReverse(reverseObj) {
        this.reverseTheme = reverseObj;
    }
    setBaseVars() {
        let avarages = [ [0, 2], [3.5, 1], [3, 1], [2.5, 1], [2, 1] ];

        let baseVars = []
        let greyVars = [];

        avarages.forEach(avr => {
            baseVars.push(Colors.avarage(this.colors.base.code.replace('#', ''), this.reverseTheme.colors.base.code.replace('#', ''), ...avr));
            greyVars.push(Colors.avarage(this.colors.base.grey.code.replace('#', ''), this.reverseTheme.colors.base.code.replace('#', ''), ...avr));
        });

        this.colors.base.vars = [ ...Object.values(baseVars) ];
        this.colors.base.grey.vars = [ ...Object.values(new Colors(this.colors.base.grey.code, this.reverseTheme.colors.base.grey.code, avarages)) ];
    }
    setGrey(color) {
        this.colors.base.grey.code = color;
        this.colors.base.grey.filters = [ color + "80", color + "4D", color + "CC" ];
    }
}

let readJSON = new Promise((resolve, reject) => {
    fs.readFile('./css/themeCompiler.json', (err, data) => {
        data = data.toString()
        themesJSON = JSON.parse(data)
        resolve(true)
    })
});

readJSON.then(() => {
    let cssText = []
    let themes = []
    let colors = []

    themesJSON.themes.forEach(themeDouble => {
        let lTheme = themeDouble[0][0];
        let lThemeNeut = themeDouble[0][1];
        let lThemeGrey = themeDouble[0][2];
        let dTheme = themeDouble[1][0];
        let dThemeNeut = themeDouble[1][1];
        let dThemeGrey = themeDouble[1][2];

        let lThemeObj = new Theme(lTheme, lThemeNeut);
        let dThemeObj = new Theme(dTheme, dThemeNeut);
        lThemeObj.setReverse(dThemeObj);
        dThemeObj.setReverse(lThemeObj);
        lThemeObj.setGrey(lThemeGrey);
        dThemeObj.setGrey(dThemeGrey);

        themes.push(lThemeObj);
        themes.push(dThemeObj);
    })
    Object.keys(themesJSON.colors).forEach( color => { colors.push(color) } )

    themes.forEach(theme => {
        let JSONColors = themesJSON.colors;
        colors.forEach(color => {
            if (JSONColors[color][theme.name] !== undefined) theme.addColor(color, JSONColors[color][theme.name])
        });
        
        theme.setBaseVars();
    })

    let noCircularThemes = {};
    themes.forEach(theme => {
        noCircularThemes[theme.name] = theme.colors
        noCircularThemes[theme.name].base.reverse = theme.reverseTheme.name
    })
    
    fs.writeFile('./css/themes.json', JSON.stringify(noCircularThemes), () => {})

    cssText[0] = "";
    let cssTextTemp;

    // :root
    cssTextTemp = [];
    themes.forEach(theme => {
        let themeSection = "";

        colors.forEach(colorName => {
            let colorSection = "";
            let colorObj = theme.colors[colorName];

            // --[color]_[theme]Theme, --[color]Var[1-4]_[theme]Theme
            colorObj.vars.forEach((colorVar, index) => {
                if (index == 0) {
                    colorSection += `--${colorName}_${theme.name}Theme: ${colorVar};`
                } else {
                    colorSection += `--${colorName}Var${index}_${theme.name}Theme: ${colorVar};`
                }
            })
            // --[color]Filter[1-3]_[theme]Theme
            colorObj.filters.forEach((filter, index) => {
                colorSection += `--${colorName}Filter${index + 1}_${theme.name}Theme: ${filter};`
            })
            
            themeSection += colorSection;
        })

        let baseColor = theme.colors.base;
        // --[base]
        themeSection += `--${theme.name}: ${baseColor.code};`
        // --[base]Var[1-4]
        baseColor.vars.forEach((varColor, index) => {
            if (index == 0) return;
            themeSection += `--${theme.name}Var${index}: ${varColor};`;
        })
        // --[base]Filter[1-3]
        baseColor.filters.forEach((filter, index) => {
            themeSection += `--${theme.name}Filter${index + 1}: ${filter};`;
        })
        // --grey_[theme]Theme
        themeSection += `--grey_${theme.name}Theme: ${baseColor.grey.code};`
        // --greyVar[1-4]_[theme]Theme
        baseColor.grey.vars.forEach((varColor, index) => {
            if (index == 0) return;
            themeSection += `--greyVar${index}_${theme.name}Theme: ${varColor};`;
        })
        // --greyFilter[1-3]_[theme]Theme
        baseColor.grey.filters.forEach((filter, index) => {
            themeSection += `--greyFilter${index + 1}_${theme.name}Theme: ${filter};`;
        })

        cssTextTemp.push(themeSection);
    })

    cssText = `:root {${cssTextTemp.join('')}}`;

    // :root.[themeClass], .[themeClass], .[themeClass] *
    cssTextTemp = [];
    themes.forEach(theme => {
        cssTextTemp = [];
        let reverseTheme = theme.reverseTheme;

        colors.forEach(colorName => {
            let colorSection = "";
            let colorObj = theme.colors[colorName];

            // [color], [color]Var[1-4]
            colorObj.vars.forEach((colorVar, index) => {
                if (index == 0) {
                    colorSection += `--${colorName}: var(--${colorName}_${theme.name}Theme, ${colorVar});`;
                } else {
                    colorSection += `--${colorName}Var${index}: var(--${colorName}Var${index}_${theme.name}Theme, ${colorVar});`;
                }
            })
            // [color]Filter[1-3]
            colorObj.filters.forEach((filter, index) => {
                colorSection += `--${colorName}Filter${index + 1}: var(--${colorName}Filter${index + 1}_${theme.name}Theme, ${filter});`;
            })

            cssTextTemp.push(colorSection);
        });

        colors.forEach(colorName => {
            let colorSection = "";
            let colorObj = reverseTheme.colors[colorName];

            // [color]_reverse, [color]Var[1-4]_reverse
            colorObj.vars.forEach((colorVar, index) => {
                if (index == 0) {
                    colorSection += `--${colorName}_reverse: var(--${colorName}_${reverseTheme.name}Theme, ${colorVar});`;
                } else {
                    colorSection += `--${colorName}Var${index}_reverse: var(--${colorName}Var${index}_${reverseTheme.name}Theme, ${colorVar});`;
                }
            })
            // [color]Filter[1-3]_reverse
            colorObj.filters.forEach((filter, index) => {
                colorSection += `--${colorName}Filter${index + 1}_reverse: var(--${colorName}Filter${index + 1}_${reverseTheme.name}Theme, ${filter});`;
            })

            cssTextTemp.push(colorSection);
        })

        let baseColor = theme.colors.base;
        let baseColorText = "";
        // --base, --baseVar[1-4], --baseFilter[1-3]
        baseColorText += `--base: var(--${theme.name}, ${baseColor.code});`;
        baseColor.vars.forEach((varColor, index) => {
            if (index == 0) return;
            baseColorText += `--baseVar${index}: var(--${theme.name}Var${index}, ${varColor});`;
        })
        baseColor.filters.forEach((filter, index) => {
            baseColorText += `--baseFilter${index + 1}: var(--${theme.name}Filter${index + 1}, ${filter});`;
        })
        let grey = baseColor.grey;
        let greyText = "";
        // --grey, --greyVar[1-4], --greyFilter[1-3]
        greyText += `--grey: var(--grey_${theme.name}Theme, ${grey.code});`;
        grey.vars.forEach((varColor, index) => {
            if (index == 0) return;
            greyText += `--greyVar${index}: var(--greyVar${index}_${theme.name}Theme, ${varColor});`;
        })
        grey.filters.forEach((filter, index) => {
            greyText += `--greyFilter${index + 1}: var(--greyFilter${index + 1}_${theme.name}Theme, ${filter});`
        })

        cssTextTemp.push(baseColorText, greyText);

        // --reverse, --reverseVar[1-4], --reverseFilter[1-3]
        let reverseColor = reverseTheme.colors.base;
        let reverseColorText = "";
        reverseColorText += `--reverse: var(--${reverseTheme.name}, ${reverseColor.code});`;
        reverseColor.vars.forEach((varColor, index) => {
            if (index == 0) return;
            reverseColorText += `--reverseVar${index}: var(--${reverseTheme.name}Var${index}, ${varColor});`;
        })
        reverseColor.filters.forEach((filter, index) => {
            reverseColorText += `--reverseFilter${index + 1}: var(--${reverseTheme.name}Filter${index + 1}, ${filter});`;
        })
        // --grey_reverse, --greyFilter[1-3]_reverse
        let reverseGrey = reverseColor.grey;
        let reverseGreyText = "";
        reverseGreyText += `--grey_reverse: var(--grey_${reverseTheme.name}Theme, ${reverseGrey.code});`;
        reverseGrey.vars.forEach((varColor, index) => {
            if (index == 0) return;
            reverseGreyText += `--greyVar${index}_reverse: var(--greyVar${index}_${reverseTheme.name}Theme, ${varColor});`;
        })
        reverseGrey.filters.forEach((filter, index) => {
            reverseGreyText += `--greyFilter${index + 1}_reverse: var(--greyFilter${index + 1}_${reverseTheme.name}Theme, ${filter});`;
        })

        cssTextTemp.push(reverseColorText, reverseGreyText);

        cssText += `:root.${theme.name}Theme, .${theme.name}Theme, .${theme.name}Theme * {${cssTextTemp.join('')}}`;
    })

    // :root.[mainColorClass], .[mainColorClass], .[mainColorClass] *
    cssTextTemp = [];

    if (!colors.includes('base')) colors.unshift('base');
    if (colors.includes('grey')) colors.remove(colors.indexOf('grey'));

    colors.forEach(colorName => {
        cssTextTemp = [];

        let colorSection = "";
        // --main, --mainVar[1-4], --mainFilter[1-3]
        themes[0].colors[colorName].vars.forEach((colorVar, index) => {
            if (index == 0) {
                colorSection += `--main: var(--${colorName});`;
            } else {
                colorSection += `--mainVar${index}: var(--${colorName}Var${index});`;
            }
        })
        themes[0].colors[colorName].filters.forEach((filter, index) => {
            colorSection += `--mainFilter${index + 1}: var(--${colorName}Filter${index + 1});`;
        })

        // --main_reverse, --mainVar[1-4]_reverse, --mainFilter[1-3]_reverse
        themes[0].colors[colorName].vars.forEach((colorVar, index) => {
            if (index == 0) {
                colorSection += `--main_reverse: var(--${colorName}_reverse);`;
            } else {
                colorSection += `--mainVar${index}_reverse: var(--${colorName}Var${index}_reverse);`;
            }
        })
        themes[0].colors[colorName].filters.forEach((filter, index) => {
            colorSection += `--mainFilter${index + 1}_reverse: var(--${colorName}Filter${index + 1}_reverse);`;
        })

        themes.forEach(theme => {
            let colorObj = theme.colors[colorName];
            // --main_[theme]Theme, --mainVar[1-4]_[theme]Theme, --mainFilter[1-3]_[theme]Theme
            colorObj.vars.forEach((colorVar, index) => {
                if (index == 0) {
                    colorSection += `--main_${theme.name}Theme: var(--${colorName}_${theme.name}Theme);`;
                } else {
                    colorSection += `--mainVar${index}_${theme.name}Theme: var(--${colorName}Var${index}_${theme.name}Theme);`;
                }
            })
            colorObj.filters.forEach((filter, index) => {
                colorSection += `--mainFilter${index + 1}_${theme.name}Theme: var(--${colorName}Filter${index + 1}_${theme.name}Theme);`;
            })
        })
        
        cssTextTemp.push(colorSection);
        cssText += `:root.${colorName}Main, .${colorName}Main, .${colorName}Main * {${cssTextTemp.join('')}}`;

        // :root.mainGrey, .mainGrey, .mainGrey *
        let greySection = "";
        let greyModel = themes[0].colors.base.grey;

        greyModel.vars.forEach((varColor, index) => {
            if (index == 0) {
                // --main
                greySection += `--main: var(--grey);`;
            } else {
                // --mainVar[1-4]
                greySection += `--mainVar${index}: var(--greyVar${index});`;
            }
        })

        greyModel.filters.forEach((varColor, index) => {
            // --mainFilter[1-3]
            greySection += `--mainFilter${index + 1}: var(--greyFilter${index + 1});`;
        })

        greyModel.vars.forEach((varColor, index) => {
            if (index == 0) {
                // --main_reverse
                greySection += `--main_reverse: var(--grey_reverse);`;
            } else {
                // --mainVar[1-4]_reverse
                greySection += `--mainVar${index}_reverse: var(--greyVar${index}_reverse);`;
            }
        })

        greyModel.filters.forEach((varColor, index) => {
            // --mainFilter[1-3]_reverse
            greySection += `--mainFilter${index + 1}_reverse: var(--greyFilter${index + 1}_reverse);`;
        })
    
        themes.forEach(theme => {
            let grey = theme.grey;

            greyModel.vars.forEach((varColor, index) => {
                if (index == 0) {
                    // --main_[theme]
                    greySection += `--main_${theme.name}Theme: var(--grey_${theme.name}Theme);`;
                } else {
                    // --mainVar[1-4]_[theme]
                    greySection += `--mainVar${index}_${theme.name}Theme: var(--greyVar${index}_${theme.name}Theme);`;
                }
            })
    
            greyModel.filters.forEach((varColor, index) => {
                // --mainFilter[1-3]_[theme]
                greySection += `--mainFilter${index + 1}_${theme.name}Theme: var(--greyFilter${index + 1}_${theme.name}Theme);`;
            })
        })

        cssText += `:root.greyMain, .greyMain, .greyMain * {${greySection}}`
    })


    fs.writeFile('./css/themes.css', cssText, () => {});
})