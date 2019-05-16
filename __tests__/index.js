/// SNAPSHOT TESTS
const fs = require('fs');
const util = require('util');
const path = require('path');
const globby = require('globby');
const { execSync } = require('child_process');
const cases = require('jest-in-case');
const readFile = util.promisify(fs.readFile);
// const { toMatchFile } = require('jest-file-snapshot');
// expect.extend({ toMatchFile });

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

  cases('output files should match snapshots', opts => {
    const filePaths = globby.sync(opts.pattern, { ignore: ['CHANGELOG.md', 'package.json']});
    filePaths.sort().forEach(filePath => {
      const file = fs.readFileSync(filePath, 'utf-8').toString();
      expect(stripComments(file)).toMatchSnapshot();
    });
  }, [
    { pattern: './packages/design-tokens-css/*.css', name: 'css' },
    { pattern: './packages/design-tokens-scss/*.scss', name: 'scss' },
    { pattern: './packages/design-tokens-less/*.less', name: 'less' },
    { pattern: './packages/design-tokens-js/src/*.js', name: 'js' },
    { pattern: './packages/design-tokens-json/*/*', name: 'json' },
  ]);

})
