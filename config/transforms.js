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
  }
];

// in order to use a transform it must be added to a group and applied in the config per platform
const transformGroups = [
  {
    name: 'custom',
    transforms: ['category', 'name/cti/snake']
  }
];

module.exports.transformGroups = transformGroups;
module.exports.transforms = transforms;