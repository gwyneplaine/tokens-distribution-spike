const cjs = require('./cjs');
const sketch = require('./sketch');

const startCase = require('lodash/startCase');

function MDX(dictionary) {
  const topLevels = Object.entries(dictionary.properties);
  let str = ``;

  function MDXContent(dictionary, level, first) {
    const category = dictionary[0];

    let isToken = dictionary[1].hasOwnProperty("value");

    if (isToken) {
      str += `\n| ${dictionary[0]} | ${dictionary[1].value} |`;
    } else {
      const subdictionary = Object.entries(dictionary[1]);
      const hasProperties = subdictionary.every(function(item) {
        return item[1].hasOwnProperty("value");
      })

      const heading = `#`.repeat(level);
      const spacing = `${first ? `` : level === 0 ? `\n\n` : `\n`}`;
      str += `${spacing}#${heading} ${startCase(category)}`;

      if (hasProperties) {
        str += `\n| Name | Value |\n| ---- | ----- |`;
      }

      level++;
      for (let i = 0; i < subdictionary.length; i++) {
        const subdict = subdictionary[i];
        MDXContent(subdict, level, false);
      }
    }
  }

  topLevels.forEach(function(dictionary, i) {
    if (i === 0) {
      MDXContent(dictionary, 0, true);
    } else {
      MDXContent(dictionary, 0, false);
    }
  });

  return str;
}


const customFormats = [
  {
    name: 'sketch-palette',
    formatter: sketch
  },
  {
    name: 'javascript/cjs',
    formatter: cjs
  },
  {
    name: 'docs/mdx',
    formatter: function(dictionary, config) {
      return MDX(dictionary);
    }
  }
];

module.exports = customFormats;
