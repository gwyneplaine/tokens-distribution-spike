const fs = require('fs');
const path = require('path');

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

// prepareFiles takes a dictionary of filePaths and returns an array of objects with:
// a targetPath
// file contents
function prepareFiles(srcFiles) {
  return Object.entries(srcFiles).map(([key, value]) => {
    let targetPath = `../../packages/design-tokens-${key}/index.${key}`;
    if (key === 'js') {
      targetPath = `../../packages/design-tokens-js/src/index.js`;
    }
    return {
      targetPath,
      file: createReferences(key, value),
    }
  });
}


function generateIndexFiles (dictionary, config) {
  // Grab destination files from style-dictionary config.
  const destinationFiles = config.files.filter(f => !f.destination.includes('index.')).map(f => f.destination);
  // Reduce destination files to a dictionary of arrays, with each key corresponding to an output format.
  const sortedImportPaths = destinationFiles.reduce((acc, curr) => {
    const [match] = curr.match(/\.[0-9a-z]+$/i);
    const fileExt = match.substring(1);
    const importPath = curr.split('/').pop();
    if (acc[fileExt]) {
      acc[fileExt].push(importPath);
    } else {
      acc[fileExt] = [importPath];
    }
    return acc;
  }, {});

  // Prep files
  const references = prepareFiles(sortedImportPaths).filter( i => i.file);

  references.forEach(ref => {
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



module.exports = {
  name: 'generate_index_files',
  do: generateIndexFiles,
  undo: removeIndexFiles,
}
