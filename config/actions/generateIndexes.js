const fs = require('fs');
const findUp = require('find-up');
const path = require('path');
const mainFilePattern = 'index.';

// This might be better as a map over dictionary of tagged template fns
// given that switches evaluate linearly while dictionaries are logarithmic.
// But this seems trivial, and a switch is a concise readable abstraction
// for the amount of formats we have at the moment.

function createReferences (fileExt, importPaths) {
  switch (fileExt) {
    case 'js':
      return importPaths.map(p => `export * from './${p}';`).join('\n');
    case 'scss':
    case 'less':
      return importPaths.map(p => `@import './${p}';`).join('\n');
    default:
      return undefined;
  }
};

// prepareFiles takes a dictionary of filePaths and returns an array of objects with:
// - a targetPath
// - file contents
function prepareFiles(srcFiles, buildPath) {
  // Using findup feels like a micro-optimisation,
  // but it makes this code slightly more resilient to future directory changes.
  const workspace = findUp.sync(buildPath, { type: 'directory' });
  return Object.entries(srcFiles).map(([targetDirectory, { fileExt, importPaths }]) => {
    let targetPath = `${workspace}/${targetDirectory}/${mainFilePattern}${fileExt}`;
    return {
      targetPath,
      file: createReferences(fileExt, importPaths),
    }
  });
};

function analyseDestinationPath(filePath) {
  const [match] = filePath.match(/\.[0-9a-z]+$/i);
  const fileExt = match.substring(1);
  const importPath = filePath.split('/').pop();
  const targetDirectory = filePath.match(/.+?(?=\/[0-9a-z]+\.[0-9a-z]+$)/i);

  return { fileExt, targetDirectory, importPath };
}

function generateSortedImportPaths (filePaths) {
  return filePaths
    .map(f => f.destination)
    .filter(f => !f.includes(mainFilePattern))
    .reduce((acc, curr) => {
    const { fileExt, targetDirectory, importPath } = analyseDestinationPath(curr);
    if (!acc[targetDirectory]) {
      acc[targetDirectory] = { fileExt, importPaths: [] };
    }
    acc[targetDirectory].importPaths.push(importPath);
    return acc;
  }, {});
}

function generateIndexFiles (dictionary, config) {
  // Grab destination files from style-dictionary config.
  const { buildPath, files } = config;
  const sortedImportPaths = generateSortedImportPaths(files);

  // Prep files
  const references = prepareFiles(sortedImportPaths, buildPath).filter(i => i.file);
  references.forEach(ref => {
    try {
      fs.writeFileSync(ref.targetPath, ref.file);
    } catch (e) {
      throw new Error(e);
    }
  });
};

function removeIndexFiles (dictionary, config) {
  // TODO, VALIDATE WHETHER OR NOT WE NEED THIS.
  const workspace = findUp.sync(config.buildPath, { type: 'directory' });

  const sortedImportPaths = generateSortedImportPaths(config.files);
  Object.keys(sortedImportPaths).forEach(targetDirectory => {
    const filePath = path.resolve(workspace, targetDirectory, 'index.js');
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (e) {
      throw Error(e);
    }
  });
};

module.exports = {
  name: 'generate_index_files',
  do: generateIndexFiles,
  undo: removeIndexFiles,
}
