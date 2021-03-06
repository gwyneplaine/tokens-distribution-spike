const formats = {
  css: [
    {
      path: 'css/',
      format: 'css/variables',
      extension: '.css'
    },
    {
      path: 'less/',
      format: 'less/variables',
      extension: '.less'
    },
    {
      path: 'scss/',
      format: 'scss/variables',
      extension: '.scss'
    },
  ],
  typescript: [
    {
      path: 'ts/src/',
      format: 'javascript/es6',
      extension: '.ts',
    }
  ],
  json: [
    {
      path: 'json/',
      format: 'json',
      extension: '.json'
    },
    {
      path: 'json/flat/',
      format: 'json/flat',
      extension: '.json'
    }
  ],
  sketch: [
    {
      path: 'sketch/',
      format: 'sketch-palette',
      extension: '.json',
    }
  ]
};

module.exports = formats;
