// note: should we consider adding types or schema validation for when teams start to create their own tokens?
module.exports = {
  font: {
    size: {
      default: { value: '14px' },
      small: { value: '11px' }
    },
    family: {
      default: {
        value: {
          default: [
            '-apple-system',
            'BlinkMacSystemFont',
          ],
          custom: [
            'Segoe UI',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Fira Sans',
            'Droid Sans',
            'Helvetica Neue',
          ],
          fallback: [ // fallback is required
            'sans-serif'
          ]
        }
      },
      code: {
        value: {
          custom: [
            'SFMono-Medium',
            'SF Mono',
            'Segoe UI Mono',
            'Roboto Mono',
            'Ubuntu Mono',
          ],
          fallback: [
            'Menlo',
            'Consolas',
            'Courier',
            'monospace'
          ]
        }
      }
    }
  }
}