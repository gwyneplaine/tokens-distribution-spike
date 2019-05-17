const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const globby = require('globby');
const rimraf = require('rimraf');

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

function createReferences (fileExt, importPaths) {
  switch (fileExt) {
    case 'js':
      return importPaths.map(p => `export * from './${p}';`).join('\n');
    case 'scss':
    case 'less':
      return importPaths.map(p => `@import './${p}';`).join('\n');
    default:
      return void 0;
  }
}

function prepareFiles(srcFiles) {
  return Object.entries(srcFiles).map(([key, value]) => {
    let targetPath = `../packages/design-tokens-${key}/index.${key}`;
    if (key === 'js') {
      targetPath = `../packages/design-tokens-js/src/index.js`;
    }
    return {
      targetPath,
      file: createReferences(key, value),
    }
  });
}


function generateIndexFiles (dictionary, config) {
  const destinationFiles = config.files.map(f => f.destination);

  const sortedImportPaths = destinationFiles.reduce((acc, curr) => {
    const [match] = curr.match(/\.[0-9a-z]+$/i);
    const fileExt = match.substring(1);
    console.log(fileExt);
    const importPath = curr.split('/').pop();
    if (acc[fileExt]) {
      acc[fileExt].push(importPath);
    } else {
      acc[fileExt] = [importPath];
    }
    return acc;
  }, {});

  console.log(sortedImportPaths);

  const references = prepareFiles(sortedImportPaths).filter( i => i.file);
  console.log(references);
  references.forEach(ref => {
    console.log('EWD',ref);
    try {
      fs.writeFileSync(path.resolve(__dirname, ref.targetPath), ref.file);
    } catch (e) {
      throw new Error(e);
    }
  });
}

function removeIndexFiles (dictionary, config) {
  console.log(dictionary, config);
}

const actions = [{
  name: 'generate_index_files',
  do: generateIndexFiles,
  undo: removeIndexFiles,
},
{
  name: 'setup_entrypoints',
  do: setupEntrypoints,
  undo: removeEntrypoints,
}];

module.exports = actions;
