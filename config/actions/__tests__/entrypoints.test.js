const { do: setupEntrypoints } = require('../entrypoints');
describe('entrypoints.js', () => {
  describe('setupEntrypoints()', () => {
    it('should add entrypoints correlatory to category to the directory specified in config', () => {
      const dictionary = {
        properties: {
          color: [],
          spacing: [],
        }
      };
      const config = {
        buildPath: 'config/actions/__mocks__',
        files: [{
          destination: ''
        }]
      };
      setupEntrypoints(dictionary, config);
    });
  });
  describe('removeEntrypoints()', () => {
    it('should remove all entrypoint folders and associated files', () => {

    })
  })
});
