const getLeaf = (object) => {
  const properties = Object.keys(object);
  if (!properties) return;
  if (properties.includes('value')) {
    return object.value;
  } else {
    const to_ret = properties.reduce((acc, curr) => {
      acc[curr] = getLeaf(object[curr]);
      return acc;
    }, {});
    return to_ret;
  };
};

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
  }
];

module.exports = customFormats;
