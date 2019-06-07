const fs = require('fs');
const path = require('path');
const globby = require('globby');
const { deleteDirectory } = require('../utils');
const { do: setupEntrypoints, undo: removeEntrypoints } = require('../entrypoints');
describe('entrypoints.js', () => {
  beforeEach(() => {
    fs.mkdirSync(path.resolve(__dirname, '../__mock-entrypoints__'));
  });
  afterEach(() => {
    const targetDirectory = path.resolve(__dirname,'../__mock-entrypoints__');
    deleteDirectory(targetDirectory);
  });
  describe('setupEntrypoints()', () => {
    it('should add entrypoints correlatory to category to the directory specified in config', () => {
      const dictionary = {
        properties: {
          color: [],
          spacing: [],
        }
      };
      const config = {
        buildPath: './config/actions',
        files: [
          { destination: '__mock-entrypoints__/src/index.js' },
        ]
      };
      setupEntrypoints(dictionary, config);

      const baseDir = path.resolve(__dirname, '../__mock-entrypoints__');
      const directories = fs.readdirSync(baseDir);

      expect(directories).toEqual(expect.arrayContaining(Object.keys(dictionary.properties)));
      directories.forEach(d => {
        expect(fs.lstatSync(path.resolve(baseDir, d)).isDirectory());
      })
    });
  });
  describe('removeEntrypoints()', () => {
    it('should remove all entrypoint folders and associated files', () => {
      const dictionary = {
        properties: {
          color: [],
        }
      };
      const config = {
        buildPath: './config/actions',
        files: [
          { destination: '__mock-entrypoints__/design-tokens-js/src/index.js' },
        ]
      };
      setupEntrypoints(dictionary, config);
      const dirPath = path.resolve(__dirname, '../__mock-entrypoints__');
      expect(fs.lstatSync(path.resolve(dirPath, 'design-tokens-js/color')).isDirectory());
      removeEntrypoints(dictionary, config);
      expect(fs.readdirSync(path.resolve(dirPath, 'design-tokens-js')).length).toEqual(0);
    });
  })
});
