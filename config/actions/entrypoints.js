const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const globby = require('globby');
const findUp = require('find-up');
const { analyseDestinationPath, deleteDirectory } = require('./utils');

function createPkgConfig (filename, fileExt, pkgName) {
  if (fileExt === 'js' || fileExt === 'ts') {
    return {
      main: `dist/${pkgName}.cjs.js`,
      module: `dist/${pkgName}.esm.js`,
      preconstruct: {
        source: `../src/${filename}`,
      }
    }
  }
  return undefined;
};

function getDirectories (files, workspace) {
  return files.reduce((acc, { destination }) => {
    const { fileExt, directoryPath } = analyseDestinationPath(destination);
    const targetDirectory = directoryPath.replace('/src', '');
    const targetPath = path.resolve(__dirname, workspace, targetDirectory);
    if (!acc.find(target => target.targetPath === targetPath)) {
      acc.push({ targetPath, fileExt, pkgName: targetDirectory });
    }
    return acc;
  }, []);
};

function setupEntrypoints (dictionary, config) {
  const propertyKeys = Object.keys(dictionary.properties);
  // find the workspace by recursively traversing up
  // the fs till we find a folder matching the specified build path.
  const workspace = findUp.sync(config.buildPath, { type: 'directory' });
  // Resolve the destination path we want to build the entrypoint folders
  // based on this directory, the resolved workspace, and our target repo
  const directories = getDirectories(config.files, workspace);

  // FILE IO
  directories.forEach(({ fileExt, targetPath, pkgName }) => {
    propertyKeys.forEach(fileName => {
      const data = createPkgConfig(fileName, fileExt, pkgName);
      execSync(`mkdir -p ${targetPath}/${fileName}`);
      fs.writeFileSync(`${targetPath}/${fileName}/package.json`, JSON.stringify(data, null, 2));
    });
  });
}

function removeEntrypoints (dictionary, config) {
  const propertyKeys = Object.keys(dictionary.properties);
  const workspace = findUp.sync(config.buildPath, { type: 'directory' });
  const destinationPath = path.resolve(__dirname, workspace, 'design-tokens-js');
  const directories = getDirectories(config.files, workspace);
  // FILE IO

  directories.forEach(({ fileExt, targetPath }) => {
    const directories = fs.readdirSync(targetPath)
      .map(filePath => path.resolve(targetPath, filePath))
      .filter(filePath => {
        return filePath !== path.resolve(targetPath, 'package.json')
        && filePath !== path.resolve(targetPath, 'CHANGELOG.md')
        && filePath !== path.resolve(targetPath, '.babelrc')
        && filePath !== path.resolve(targetPath, 'tsconfig.json')
      });
    directories.forEach(deleteDirectory);
  });
}

module.exports = {
  name: 'setup_entrypoints',
  do: setupEntrypoints,
  undo: removeEntrypoints,
};
