/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  theme: {
    extend: {
      screens: {
        '2xl': '1700px',
      },
      opacity: {
        10: '.1',
        20: '.2',
        30: '.3',
        40: '.4',
        50: '.5',
        60: '.6',
        70: '.7',
        80: '.8',
        90: '.9',
        100: '1',
      },
      colors: {
        whiteish: '#FEFEFE',
        blackish: '#222',
        gdp: '#5353EC',
        cyan: '#3AB8C5',
        opaqueWhite: 'rgba(255,255,255,.05)',
        opaqueBlack: 'rgba(0,0,0,.05)',
        opaqueIndigo: 'rgba(83,83,267,.1)'
      }
    }
  },
  variants: {},
  plugins: [],
  experimental: {
    uniformColorPalette: true
  },
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ]
  }
};
