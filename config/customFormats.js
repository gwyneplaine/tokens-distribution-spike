const _ = require('lodash');

const customFormats = [
  {
    name: 'sketch-palette',
    formatter: function(dictionary, config) {
      // Poly filling the sketch palette format because theirs depends on CTI
      var to_ret = {
        'compatibleVersion':'1.0',
        'pluginVersion':'1.1'
      };
      to_ret.colors = _.chain(dictionary.allProperties)
        .filter(function(prop) {
          return prop.original.category === 'color';
        })
        .map(function(prop) {
          return prop.value;
        })
        .value();
      return JSON.stringify(to_ret, null, 2);
    }
  }
];

module.exports = customFormats;