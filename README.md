# Tokens Distribution Spike
## Introduction

This is the initial spike for design token build and distribution infrastructure using style-dictionary.
Given a spec declared in the properties folder, tokens will be output via style-dictionary to specified formats.
Custom formats are specified in the config folder under ./customFormats, these are then registered with StyleDictionary in the build.js file.

## Getting Started
To see this workflow in action, run:

```
yarn && yarn build
```

This will build the relevant output files to folders in the packages/ directory.
Each output format is built into a publishable package such that consumers can:

```
import colors from '@ds-tokens/design-tokens-css/colors';
```


## Adding a new format:

In order to create a new format, we first have to set up a new package in the packages directory.

### Setup a new package
To setup a new package, run:

```
yarn add:package
```

This will initialize a CLI to run you through creating a new folder in the packages/ directory.
At the end of this process you should have a new folder created in packages with the name you've provided, as well the specified package config file (at the moment, only package.json).
For example:

```
- packages/
 - design-tokens-scss/
  - package.json
```

### Add format to build

Next we'll need to let style-dictionary know that we wish to build to a new format.
To do this, we'll need to add the new format to the list of formats in ./config/formats.js.
To understand how to add new formats to the build process, please see the [Using Formats](https://amzn.github.io/style-dictionary/#/formats?id=using-formats) section in the style-dictionary docs.

Style-dictionary has a robust list of internally supported formats, so it might be worthwhile to check out these formats as the work may already have been done for you!
[Learn more about style-dictionary formats here](https://amzn.github.io/style-dictionary/#/formats?id=pre-defined-formats).

Should pre-defined formats not exist for your use case, you'll need to create and register a custom formatter, this should be done in the customFormats.js file. Please submit a ticket for our [Jira board](https://product-fabric.atlassian.net/jira/software/projects/DTOK/boards/371) to track this work.
To find out more about declaring custom formats, see the [custom formats](https://amzn.github.io/style-dictionary/#/formats?id=creating-formats) section of the style-dictionary docs.
