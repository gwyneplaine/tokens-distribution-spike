const camelCase = require('lodash/camelCase');
const snakeCase = require('lodash/snakeCase');

const getPropertyKeys = (prop) => {
  return prop.path[0] !== 'messaging' ? prop.path.slice(1) : prop.path;
}

const transforms = [
  {
    name: 'category',
    type: 'attribute',
    transformer: function(prop) {
      // get the top level and assign that as the property's category
      // used to filter and output files by category
      let category = prop.path[0];
      return { category: category }
    }
  },
  {
    name: 'name/ti/snake',
    type: 'name',
    transformer: function (prop, options) {
      let propertyKeys = getPropertyKeys(prop);
      return snakeCase([options.prefix].concat(propertyKeys).join(' '));
    }
  },
  {
    name: 'name/ti/camel',
    type: 'name',
    transformer: function (prop, options) {
      let propertyKeys = getPropertyKeys(prop);
      if (prop.attributes.category === 'color') {
        return [options.prefix].concat(propertyKeys).join(' ');
      };

      return camelCase([options.prefix].concat(propertyKeys).join(' '));
    }
  }
];


// in order to use a transform it must be added to a group and applied in the config per platform
const transformGroups = [
  {
    name: 'custom',
    transforms: ['category', 'name/ti/snake']
  },
  {
    name: 'javascript',
    transforms: ['category', 'name/ti/camel']
  }
];

module.exports.transformGroups = transformGroups;
module.exports.transforms = transforms;
