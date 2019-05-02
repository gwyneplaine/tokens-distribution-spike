module.exports = (dictionary, config) => {
  console.log(dictionary, config);
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
