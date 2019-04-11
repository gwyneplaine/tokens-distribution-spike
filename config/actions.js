const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const rimraf = require('rimraf');
const actions = [{
    name: 'setup_entrypoints', 
    do: function (dictionary, config) {
        const propertyKeys = Object.keys(dictionary.properties);
        const destinationPath = path.resolve(__dirname, `../${config.buildPath}`, 'design-tokens-js');
        propertyKeys.forEach(key => {
            rimraf.sync(`${destinationPath}/${key}`);
            const data = {
                main: "dist/design-tokens-js.cjs.js",
                module: "dist/design-tokens-js.esm.js",
                preconstruct: {
                    source:  `../src/${key}`,
                }
            };
            execSync(`mkdir ${destinationPath}/${key}`);
            fs.writeFileSync(`${destinationPath}/${key}/package.json`, JSON.stringify(data, null, 2))
        });
    },
    undo: function (dictionary, config) {
        const propertyKeys = Object.keys(dictionary.properties);
        const destinationPath = path.resolve(__dirname, `..${config.buildPath}/design-tokens-js`);
        propertyKeys.forEach(key => {
            rimraf.sync(`${destinationPath}/${key}/*`);
        });
    },
}];

module.exports = actions;