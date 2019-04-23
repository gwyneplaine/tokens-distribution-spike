const color = require('../color/base');

// TODO: research best ways to transform this for non-web platforms
// ex generated for web:
// e100: { value: `box-shadow: 0 1px 1px ${N50A}, 0 0 1px 0 ${N60A};`, }
// all properties in value are required
module.exports = {
  e100: {
    value: [
      {
        color: color.N50A,
        offset: {
          x: 0,
          y: '1px'
        },
        blur: '1px',
        spread: 0
      },
      {
        color: color.N60A,
        offset: {
          x: 0,
          y: 0
        },
        blur: '1px',
        spread: 0
      }
    ],
    comment: 'Cards on a board',
  },
  e200: {
    value: [
      {
        color: color.N50A,
        offset: {
          x: 0,
          y: '4px'
        },
        blur: '8px',
        spread: '-2px'
      },
      {
        color: color.N60A,
        offset: {
          x: 0,
          y: 0
        },
        blur: '1px',
        spread: 0
      }
    ],
    comment: 'Inline dialogs'
  },
  e300: {
    value: [
      {
        color: color.N50A,
        offset: {
          x: 0,
          y: '8px'
        },
        blur: '16px',
        spread: '-4px'
      },
      {
        color: color.N60A,
        offset: {
          x: 0,
          y: 0
        },
        blur: '1px',
        spread: 0
      }
    ],
    comment: 'Modals'
  },
  e400: {
    value: [
      {
        color: color.N50A,
        offset: {
          x: 0,
          y: '12px'
        },
        blur: '24px',
        spread: '-6px'
      },
      {
        color: color.N60A,
        offset: {
          x: 0,
          y: 0
        },
        blur: '1px',
        spread: 0
      }
    ],
    comment: 'Panels'
  },
  e500: {
    value: [
      {
        color: color.N50A,
        offset: {
          x: 0,
          y: '20px'
        },
        blur: '32px',
        spread: '-8px'
      },
      {
        color: color.N60A,
        offset: {
          x: 0,
          y: 0
        },
        blur: '1px',
        spread: 0
      }
    ],
    comment: 'Flag messages (notifications)'
  }
}