const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const globby = require('globby');
const findUp = require('find-up');

function createPkgConfig (filename, fileExt) {
  if (fileExt === 'js') {
    return {
      main: 'dist/design-tokens-js.cjs.js',
      module: 'dist/design-tokens-js.esm.js',
      preconstruct: {
        source: `../src/${filename}`,
      }
    }
  }
  return undefined;
};

function getDirectories (files, workspace) {
  console.log(files);
  return files.reduce((acc, { destination }) => {
    const [match] = destination.match(/\.[0-9a-z]+$/i);
    const fileExt = match.substring(1);
    const targetDirectory = destination.split('/').shift();
    const targetPath = path.resolve(__dirname, workspace, targetDirectory);
    if (!acc.find(target => target.targetPath === targetPath)) {
      acc.push({ targetPath, fileExt });
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
  directories.forEach(({ fileExt, targetPath }) => {
    propertyKeys.forEach(fileName => {
      const data = createPkgConfig(fileName, fileExt);
      execSync(`mkdir ${targetPath}/${fileName}`);
      fs.writeFileSync(`${targetPath}/${fileName}/package.json`, JSON.stringify(data, null, 2));
    });
  });
}

function deleteDirectory (directoryPath) {
  if (!fs.existsSync(directoryPath)) return;
  const entryPaths = fs.readdirSync(directoryPath);
  entryPaths.forEach(entryPath => {
    const resolvedPath = path.resolve(directoryPath, entryPath);
    if (fs.lstatSync(resolvedPath).isDirectory()) {
      deleteDirectory(resolvedPath);
    } else {
      fs.unlinkSync(resolvedPath);
    };
  });
  fs.rmdirSync(directoryPath);
}

function removeEntrypoints (dictionary, config) {
  const propertyKeys = Object.keys(dictionary.properties);
  const workspace = findUp.sync(config.buildPath, { type: 'directory' });
  const destinationPath = path.resolve(__dirname, workspace, 'design-tokens-js');
  // FILE IO
  const directories = fs.readdirSync(destinationPath)
    .map(filePath => path.resolve(destinationPath, filePath))
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
};
