const getLeaf = (object) => {
  const properties = Object.keys(object);
  if (!properties) return;
  if (properties.includes('value')) {
    return object.value;
  } else {
    const to_ret = properties.reduce((acc, curr) => {
      const key = curr.replace('.', '');
      acc[key] = getLeaf(object[curr]);
      return acc;
    }, {});
    return to_ret;
  };
};

function MDX(dictionary, str) {
  const topLevels = Object.entries(dictionary.properties);

  function MDXContent(dictionary, level) {
    const category = dictionary[0];

    let isToken = dictionary[1].value;

    if (isToken) {
      str += `\n| ${dictionary[0]} | ${dictionary[1].value} |`;
    } else {
      const subdictionary = Object.entries(dictionary[1]);
      const hasProperties = subdictionary.every(function(item) {
        return item[1].value;
      })

      const heading = `#`.repeat(level);
      str += `\n#${heading} ${category}`;

      if (hasProperties) {
        str += `\n| Name | Value |\n| ---- | ----- |`;
      }

      level++;
      for (let i = 0; i < subdictionary.length; i++) {
        const subdict = subdictionary[i];
        MDXContent(subdict, level);
      }
    }
  }

  topLevels.forEach(function(dictionary) {
    MDXContent(dictionary, 0);
  });

  return str;
}


const customFormats = [
  {
    name: 'sketch-palette',
    formatter: function(dictionary, config) {
      // Poly filling the sketch palette format because theirs depends on CTI
      var to_ret = {
        'compatibleVersion':'1.0',
        'pluginVersion':'1.1'
      };
      to_ret.colors = dictionary.allProperties
        .filter(function(prop) {
          return prop.attributes.category === 'color';
        })
        .map(function({ name, value }) {
          return { name, value };
        })

      return JSON.stringify(to_ret, null, 2);
    }
  },
  {
    name: 'javascript/cjs',
    formatter: function (dictionary, config) {
      var to_ret = getLeaf(dictionary.properties);
      return `module.exports = ${JSON.stringify(to_ret, null, 2)}`
    }
  },
  {
    name: 'docs/mdx',
    formatter: function(dictionary, config) {
      return MDX(dictionary, '');
    }
  }
];

module.exports = customFormats;
