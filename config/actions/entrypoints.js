const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const rimraf = require('rimraf');

function setupEntrypoints (dictionary, config) {
  const propertyKeys = Object.keys(dictionary.properties);
  const destinationPath = path.resolve(__dirname, `../../${config.buildPath}`, 'design-tokens-js');
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
}

function removeEntrypoints (dictionary, config) {
  const propertyKeys = Object.keys(dictionary.properties);
  const destinationPath = path.resolve(__dirname, `..${config.buildPath}/design-tokens-js`);
  propertyKeys.forEach(key => {
    rimraf.sync(`${destinationPath}/${key}/*`);
  });
}

module.exports = {
  name: 'setup_entrypoints',
  do: setupEntrypoints,
  undo: removeEntrypoints,
}
