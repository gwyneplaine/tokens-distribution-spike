function setupEntrypoints (dictionary, config) {
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
}

function removeEntrypoints () {
  const propertyKeys = Object.keys(dictionary.properties);
  const destinationPath = path.resolve(__dirname, `..${config.buildPath}/design-tokens-js`);
  propertyKeys.forEach(key => {
    rimraf.sync(`${destinationPath}/${key}/*`);
  });
}

module.exports = {
  setupEntrypoints,
  removeEntrypoints,
}
