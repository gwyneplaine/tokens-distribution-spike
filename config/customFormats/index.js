const cjs = require('./cjs');
const sketch = require('./sketch');

const customFormats = [
  {
    name: 'sketch-palette',
    formatter: sketch,
  },
  {
    name: 'javascript/cjs',
    formatter: cjs
  }
];

module.exports = customFormats;
