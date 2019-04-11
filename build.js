const rimraf = require('rimraf');
const StyleDictionaryPackage = require('style-dictionary');

const formats = require('./config/formats');
const transforms = require('./config/transforms').transforms;
const transformGroups = require('./config/transforms').transformGroups;
const customFormats = require('./config/customFormats');

// bypass style-dictionary's deep merge and let node do it
// other example here: https://github.com/amzn/style-dictionary/tree/master/examples/advanced/node-modules-as-config-and-properties
const properties = require('./properties');

// outputs a file configuration object
function createFile(format, name, filter) {
  let path = format.path;
  let extension = format.extension;
  let styleFormat = format.format;
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
  let files = formats[platform].map(function(format) {
    return createFile(format, 'index')
  });

  // then, for each category, output a file in each format
  Object.keys(properties).forEach(function(category) {
    let filter = function(prop) {
      return prop.attributes.category == category;
    }

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
    web: {
      transformGroup: "custom",
      buildPath: buildPath,
      files: createFiles('web')
    },
    javascript: {
      transformGroup: 'javascript',
      buildPath: buildPath,
      files: createFiles('javascript'),
    },
    general: {
      transformGroup: "custom",
      buildPath: buildPath,
      files: createFiles('general')
    },
    design: {
      transformGroup: "custom",
      buildPath: buildPath,
      files: [
        {
          destination: "sketch/palette.json",
          format: "sketch-palette"
        }
      ]
    },
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
function clean () {
  try {
    rimraf.sync('packages/*/!(package.json)*');
  } catch (e) {
    throw new Error(e);
  }
}

async function build() {
  clean();
  const StyleDictionary = StyleDictionaryPackage.extend(config);

  transforms.forEach(function(transform) {
    StyleDictionary.registerTransform(transform);
  })

  transformGroups.forEach(function(group) {
    StyleDictionary.registerTransformGroup(group);
  })

  customFormats.forEach(function(format) {
    StyleDictionary.registerFormat(format);
  })

  // StyleDictionary.cleanAllPlatforms();
  StyleDictionary.buildAllPlatforms();
}

build();
