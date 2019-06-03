const path = require('path');
const globby = require('globby');
const fs = require('fs');
const StyleDictionaryPackage = require('style-dictionary');
const actions = require('./config/actions');
const formats = require('./config/formats');
const transforms = require('./config/transforms').transforms;
const transformGroups = require('./config/transforms').transformGroups;
const customFormats = require('./config/customFormats');

// bypass style-dictionary's deep merge and let node do it
// other example here: https://github.com/amzn/style-dictionary/tree/master/examples/advanced/node-modules-as-config-and-properties
const properties = require('./properties');


// outputs a file configuration object
function createFile(format, name, filter) {
  const { path, extension, format: styleFormat } = format;

  let fileName = name;
  let file = {
    destination: 'design-tokens-' + path + fileName + extension,
    format: styleFormat,
  };

  if (filter) {
    file.filter = filter;
  }

  return file;
}

// create array of file configurations
function createFiles(platform) {
  // first do a rollup of all tokens
  let files = formats[platform].map((format) => createFile(format, 'index'));

  // then, for each category, output a file in each format
  Object.keys(properties).forEach(function(category) {
    let filter = (prop) => prop.attributes.category == category;

    formats[platform].forEach(function(format) {
      files.push(createFile(format, category, filter))
    });
  });

  return files;
}

const buildPath = "packages/";
const config = {
  source: ['properties/index.js'],
  platforms: {
    css: {
      transformGroup: "custom",
      buildPath: buildPath,
      actions: ['generate_index_files'],
      files: createFiles('css')
    },
    javascript: {
      transformGroup: 'javascript',
      buildPath: buildPath,
      actions: ['generate_index_files','setup_entrypoints'],
      files: createFiles('javascript'),
    },
    json: {
      transformGroup: "custom",
      buildPath: buildPath,
      files: createFiles('json')
    },
    design: {
      transformGroup: "custom",
      buildPath: buildPath,
      files: [
        {
          destination: "design-tokens-sketch/palette.json",
          format: "sketch-palette"
        }
      ]
    },
    docs: {
      transformGroup: 'docs',
      buildPath: buildPath,
      files: [
        {
          destination: "design-tokens-docs/tokens.mdx",
          format: "docs/mdx"
        }
      ]
    }
    // android: {
    //   transformGroup: "android",
    //   buildPath: buildPath,
    //   files: [
    //     {
    //       destination: "android/colors.xml",
    //       format: "android/colors"
    //     }
    //   ]
    // }
  }
};

// START THE BUILD
function build() {
  const StyleDictionary = StyleDictionaryPackage.extend(config);

  actions.forEach(function (action) {
    StyleDictionary.registerAction(action);
  });

  transforms.forEach(function(transform) {
    StyleDictionary.registerTransform(transform);
  })

  transformGroups.forEach(function(group) {
    StyleDictionary.registerTransformGroup(group);
  })

  customFormats.forEach(function(format) {
    StyleDictionary.registerFormat(format);
  });

  StyleDictionary.cleanAllPlatforms();
  StyleDictionary.buildAllPlatforms();
}

build();
