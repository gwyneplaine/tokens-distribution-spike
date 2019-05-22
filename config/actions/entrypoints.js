const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const globby = require('globby');
const findUp = require('find-up');

function setupEntrypoints (dictionary, config) {
  const propertyKeys = Object.keys(dictionary.properties);
  const workspace = findUp.sync(config.buildPath, { type: 'directory' });
  const destinationPath = path.resolve(__dirname, workspace, 'design-tokens-js');
  propertyKeys.forEach(key => {
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

function deleteDirectory (directoryPath) {
  if (!fs.existsSync(directoryPath)) return;
  const entryPaths = fs.readdirSync(directoryPath);
  entryPaths.forEach(entryPath => {
    if (fs.lstatSync(path.resolve(directoryPath, entryPath)).isDirectory()) {
      deleteDirectory(path.resolve(directoryPath, entryPath));
    } else {
      fs.unlinkSync(path.resolve(directoryPath, entryPath));
    };
  });
  fs.rmdirSync(directoryPath);
}

function removeEntrypoints (dictionary, config) {
  const propertyKeys = Object.keys(dictionary.properties);
  const workspace = findUp.sync(config.buildPath, { type: 'directory' });
  const destinationPath = path.resolve(__dirname, workspace, 'design-tokens-js');
  const directories = fs.readdirSync(destinationPath)
    .map(filePath=> path.resolve(destinationPath, filePath))
    .filter(filePath => {
      return filePath !== path.resolve(destinationPath, 'package.json')
       && filePath !== path.resolve(destinationPath, 'CHANGELOG.md');
    });

  directories.forEach(deleteDirectory);
}

module.exports = {
  name: 'setup_entrypoints',
  do: setupEntrypoints,
  undo: removeEntrypoints,
}
