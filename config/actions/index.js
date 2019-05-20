const { setupEntrypoints, removeEntrypoints } = require('./entrypoints');
const { generateIndexFiles, removeIndexFiles } = require('./generateIndexes');

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
