const camelCase = require('lodash/camelCase');
const snakeCase = require('lodash/snakeCase');

const getPropertyKeys = (prop) => {
  return prop.path[0] !== 'messaging' ? prop.path.slice(1) : prop.path;
}

const transforms = [
  {
    name: 'attribute/category',
    type: 'attribute',
    transformer: function (prop) {
      // get the top level and assign that as the property's category
      // used to filter and output files by category
      let attributes = {};
      if (prop.path.length > 2) {
        attributes.subcategory = prop.path[1];
      }
      attributes.category = prop.path[0];
      return attributes;
    }
  },
  {
    name: 'attribute/compound',
    type: 'attribute',
    transformer: function (prop) {
      if (typeof prop.original.value === 'object') {
        return { compound: true }
      }
      return { compound: false };
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
const base = [
  'attribute/category',
  'attribute/compound'
];

const transformGroups = [
  {
    name: 'custom',
    transforms: [...base, 'name/ti/snake']
  },
  {
    name: 'javascript',
    transforms: [...base, 'name/ti/camel']
  },
  {
    name: 'docs',
    transforms: [...base, 'name/ti/snake']
  }
];

module.exports.transformGroups = transformGroups;
module.exports.transforms = transforms;