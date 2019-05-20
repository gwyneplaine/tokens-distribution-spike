const fs = require('fs');
const findUp = require('find-up');
const path = require('path');
const mainFilePattern = 'index.';

// TODO: This might be better as a map over dictionary of tagged template fns
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
// a targetPath
// file contents
function prepareFiles(srcFiles, buildPath) {
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

function generateIndexFiles (dictionary, config) {
  // Grab destination files from style-dictionary config.
  const { buildPath, files } = config;
  const destinationFiles = files
    .map(f => f.destination)
    .filter(f => !f.includes(mainFilePattern));

  // Reduce destination files to a dictionary of arrays, with each key corresponding to an output format.
  const sortedImportPaths = destinationFiles.reduce((acc, curr) => {
    const { fileExt, targetDirectory, importPath } = analyseDestinationPath(curr);
    if (acc[targetDirectory]) {
      acc[targetDirectory].importPaths.push(importPath);
    } else {
      acc[targetDirectory] = { fileExt, importPaths: [importPath] };
    }
    return acc;
  }, {});

  // Prep files
  const references = prepareFiles(sortedImportPaths, buildPath).filter(i => i.file);
  references.forEach(ref => {
    try {
      fs.writeFileSync(path.resolve(__dirname, ref.targetPath), ref.file);
    } catch (e) {
      throw new Error(e);
    }
  });
};

function removeIndexFiles (dictionary, config) {
  console.log(dictionary, config);
};



module.exports = {
  name: 'generate_index_files',
  do: generateIndexFiles,
  undo: removeIndexFiles,
}
