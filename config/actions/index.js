const setupEntrypointsAction = require('./entrypoints');
const generateIndexFilesAction = require('./generateIndexes');

const actions = [
  setupEntrypointsAction,
  generateIndexFilesAction
];

module.exports = actions;
