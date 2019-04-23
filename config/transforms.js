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
    name: 'compound/elevation',
    type: 'value',
    matcher: (prop) => prop.path.includes('elevation'),
    transformer: function (prop) {
      let shadows = `box-shadow: `
      prop.original.value.forEach(function(shadow, i) {
        shadows += `${shadow.offset.x} ${shadow.offset.y} ${shadow.blur} ${shadow.spread} ${shadow.color.value}`;
        if (i !== prop.original.value.length - 1) {
          shadows += `, `;
        } else {
          shadows += `;`;
        }
      })
      return shadows;
    }
  },
  {
    name: 'compound/font-family',
    type: 'value',
    matcher: (prop) => {
      const path = ['typography', 'font', 'family'];
      for (let i = 0; i < path.length; i++) {
        if (prop.path[i] !== path[i]) {
          return false;
        }
      }
      return true;
    },
    transformer: (prop) => {
      return prop.original.value;
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
    transforms: [...base, 'compound/elevation', 'compound/font-family', 'name/ti/camel']
  },
  {
    name: 'docs',
    transforms: [...base, 'compound/elevation', 'compound/font-family', 'name/ti/snake']
  }
];

module.exports.transformGroups = transformGroups;
module.exports.transforms = transforms;