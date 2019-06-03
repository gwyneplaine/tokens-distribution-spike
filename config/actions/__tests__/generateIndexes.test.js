const fs = require('fs');
const globby = require('globby');
const rimraf = require('rimraf');
const path = require('path');
const cases = require('jest-in-case');
const { do: generateIndexes, undo: removeIndexes } = require('../generateIndexes');
describe('generateIndexes.js', () => {
  beforeEach(() => {
    fs.mkdirSync(path.resolve(__dirname, '../__mock-generateIndexes__'));
  });
  afterEach(() => {
    const directoryPath = path.resolve(__dirname, '../__mock-generateIndexes__');
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
          { destination: `__mock-generateIndexes__/colors.${fileExt}` },
          { destination: `__mock-generateIndexes__/spacing.${fileExt}` },
          { destination: `__mock-generateIndexes__/messaging.${fileExt}` },
        ]
      }
      generateIndexes(dictionary, config);
      const filePath = path.resolve(__dirname, `../__mock-generateIndexes__/index.${fileExt}`);
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
            { destination: '__mock-generateIndexes__/colors.scss' },
            { destination: '__mock-generateIndexes__/spacing.less' },
            { destination: '__mock-generateIndexes__/messaging.js' },
          ]
        }
        generateIndexes(dictionary, config);
        const directoryPath = '__mock-generateIndexes__/generateIndexes';
        const files = globby.sync(directoryPath);
        expect(files.includes(path.resolve(__dirname,'../__mock-generateIndexes__/index.js')));
        expect(files.includes(path.resolve(__dirname,'../__mock-generateIndexes__/index.less')));
        expect(files.includes(path.resolve(__dirname,'../__mock-generateIndexes__/index.scss')));
      });
    })

    describe('if given a file format that is not supported', () =>{
      it('does not create an index file', () => {
        const dictionary = {};
        const config = {
          buildPath: './config/actions',
          files: [
            { destination: `__mock-generateIndexes__/colors.fakeFormat` },
            { destination: `__mock-generateIndexes__/spacing.fakeFormat` },
            { destination: `__mock-generateIndexes__/messaging.fakeFormat` },
          ]
        }
        generateIndexes(dictionary,config);
        const filePath = path.resolve(__dirname, '../__mock-generateIndexes__/');
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
          { destination: `__mock-generateIndexes__/colors.js` },
        ],
      };
      generateIndexes(dictionary,config);
      const filePath = path.resolve(__dirname, '../__mock-generateIndexes__/index.js');
      expect(fs.existsSync(filePath)).toBe(true);
      removeIndexes(dictionary, config);
      expect(fs.existsSync(filePath)).not.toBe(true);
    });
  });
});
