const formats = {
  web: [
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
  javascript: [
    {
      path: 'js/src/',
      format: 'javascript/es6',
      extension: '.js'
    }
  ],
  general: [
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
  ]
};

module.exports = formats;
