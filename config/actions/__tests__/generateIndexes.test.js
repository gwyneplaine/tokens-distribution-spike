const fs = require('fs');
const globby = require('globby');
const rimraf = require('rimraf');
const path = require('path');
const cases = require('jest-in-case');
const { do: generateIndexes, undo: removeIndexes } = require('../generateIndexes');
describe('generateIndexes.js', () => {
  beforeEach(() => {
    fs.mkdirSync(path.resolve(__dirname, '../__mocks__'));
  });
  afterEach(() => {
    const directoryPath = path.resolve(__dirname, '../__mocks__');
    const files = globby.sync(directoryPath)
    files.forEach(f => {
      fs.unlinkSync(f);
    });
    fs.rmdirSync(directoryPath);
  });
  describe('generateIndexFiles()', () => {

    cases('Given', ({ fileExt }) => {
      const dictionary = {};
      const config = {
        buildPath: './config/actions',
        files: [
          { destination: `__mocks__/colors.${fileExt}` },
          { destination: `__mocks__/spacing.${fileExt}` },
          { destination: `__mocks__/messaging.${fileExt}` },
        ]
      }
      generateIndexes(dictionary, config);
      const filePath = path.resolve(__dirname, `../__mocks__/index.${fileExt}`);
      expect(fs.existsSync(filePath));
      const result = fs.readFileSync(filePath).toString();
      expect(result).toMatchSnapshot();
    }, [
      { fileExt: 'scss', name: 'scss files, it should generate an index.scss'},
      { fileExt: 'less', name: 'less files, it should generate an index.less' },
      { fileExt: 'js', name: 'js files, it should generate an index.js' },
    ])
    describe('Given multiple files in differing formats', () => {
      it('will generate index files for each format, at the specified location', () => {
        const dictionary = {};
        const config = {
          buildPath: './config/actions',
          files: [
            { destination: '__mocks__/colors.scss' },
            { destination: '__mocks__/spacing.less' },
            { destination: '__mocks__/messaging.js' },
          ]
        }
        generateIndexes(dictionary, config);
        const directoryPath = '__mocks__/generateIndexes';
        const files = globby.sync(directoryPath);
        expect(files.includes(path.resolve(__dirname,'../__mocks__/index.js')));
        expect(files.includes(path.resolve(__dirname,'../__mocks__/index.less')));
        expect(files.includes(path.resolve(__dirname,'../__mocks__/index.scss')));
      });
    })

    describe('if given a file format that is not supported', () =>{
      it('does not create an index file', () => {
        const dictionary = {};
        const config = {
          buildPath: './config/actions',
          files: [
            { destination: `__mocks__/colors.fakeFormat` },
            { destination: `__mocks__/spacing.fakeFormat` },
            { destination: `__mocks__/messaging.fakeFormat` },
          ]
        }
        generateIndexes(dictionary,config);
        const filePath = path.resolve(__dirname, '../__mocks__/');
        expect(globby.sync(filePath)).toEqual([]);
      });
    });
  });
  describe('removeIndexFiles', () => {
    it('Removes generated index files', () => {
      const dictionary = {};
      const config = {
        buildPath: './config/actions',
        files: [
          { destination: `__mocks__/colors.js` },
        ],
      };
      generateIndexes(dictionary,config);
      const filePath = path.resolve(__dirname, '../__mocks__/index.js');
      expect(fs.existsSync(filePath)).toBe(true);
      removeIndexes(dictionary, config);
      expect(fs.existsSync(filePath)).not.toBe(true);
    });
  });
});
