const sketch = require('../sketch');

describe('When transforming for sketch-pallete', () => {
  it('should output to a valid sketch json structure', () => {
    const mockDictionary = {
      properties: {
        colors: {
          R50: {
            value: "red",
          }
        }
      },
      allProperties: [
        {
          attributes: {
            category: 'color',
          },
          value: 'red',
          name: 'R50',
        }
      ]
    };
    const mockConfig = {};
    const result = JSON.stringify({
      "compatibleVersion": "1.0",
      "pluginVersion": "1.1",
      "colors": [
        {
          "name": "R50",
          "value": "red"
        },
      ]
    }, null, 2);
    expect(sketch(mockDictionary, mockConfig)).toBe(result);
  })
})
