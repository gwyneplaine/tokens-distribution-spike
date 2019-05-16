/// SNAPSHOT TESTS
const fs = require('fs');
const util = require('util');
const globby = require('globby');
const { execSync } = require('child_process');
const cases = require('jest-in-case');
const readFile = util.promisify(fs.readFile);

const stripComments = (file) => {
  return file.replace(/\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*\/+/gi, '')
}

describe('on yarn build', () => {
  beforeAll(() => {
    execSync('yarn build');
  });
  afterAll(() => {
    console.time('CLEAN');
    rimraf.sync('packages/*/!(package.json)*/!(package.json)*');
    console.timeEnd('CLEAN');
  });

  cases('output files should match snapshots', async opts => {
    const filePaths = await globby(opts.pattern, { ignore: ['CHANGELOG.md', 'package.json']});
    await Promise.all(filePaths.map(async filePath => {
      const file = await readFile(filePath, 'utf-8');
      return file;
    })).then(files => {
      files.forEach(file => {
        expect(stripComments(file)).toMatchSnapshot();
      })
    });
  }, [
    { pattern: './packages/design-tokens-css/*.css', name: 'css' },
    { pattern: './packages/design-tokens-scss/*.scss', name: 'scss' },
    { pattern: './packages/design-tokens-less/*.less', name: 'less' },
    { pattern: './packages/design-tokens-js/src/*.js', name: 'js' },
    { pattern: './packages/design-tokens-json/*/*', name: 'json' },
  ]);

})
