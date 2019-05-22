module.exports = (dictionary, config) => {
  const reduceValue = (object) => {
    const properties = Object.keys(object);
    if (!properties) return;
    if (properties.includes('value')) {
      return object.value;
    } else {
      const to_ret = properties.reduce((acc, curr) => {
        const key = curr.replace('.', '');
        acc[key] = reduceValue(object[curr]);
        return acc;
      }, {});
      return to_ret;
    };
  };

  var to_ret = reduceValue(dictionary.properties);
  return `module.exports = ${JSON.stringify(to_ret, null, 2)}`
}
