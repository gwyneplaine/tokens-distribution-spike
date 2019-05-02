# Tokens Distribution Spike
## Introduction

This is the initial spike for design token build and distribution infrastructure using style-dictionary.
Given a spec declared in the properties folder, tokens will be output via style-dictionary to specified formats.

Custom formats are specified in the config folder under ./customFormats, these are then registered with StyleDictionary in the build.js file.

## Getting Started
To see this workflow in action, run
```
yarn && yarn build
```
This will build the relevant output files to folders in the packages/ directory. 
