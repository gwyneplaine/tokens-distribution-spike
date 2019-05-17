const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const globby = require('globby');
const rimraf = require('rimraf');

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
