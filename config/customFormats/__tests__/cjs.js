var fs = require('fs');
var cjs = require('../cjs');

describe('When transforming to CJS format', () => {
  it('should reduce the leaf node down to a value', () => {
    const mockDictionary = {
      properties: {
        colors: {
          R50: {
            value: "red"
          }
        }
      }
    };
    const mockConfig = {};
    const result = `module.exports = ${JSON.stringify({ colors: { R50: "red" } }, null, 2)}`;
    expect(cjs(mockDictionary, mockConfig)).toBe(result);
  })
})
