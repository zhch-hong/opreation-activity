module.exports = {
  plugins: {
    // 'postcss-pxtorem': {
    //   rootValue: 192,
    //   minPixelValue: 2,
    //   propList: ['*'],
    //   selectorBlackList: ['ignore'],
    // },
    'postcss-px-to-viewport': {
      viewportWidth: 1920,
      unitPrecision: 6,
      // propList: ['*', '!font*'],
      // fontViewportUnit: 'px',
      selectorBlackList: ['ignore', 'van'],
      include: /\/src\//,
      landscapeWidth: 1080,
    },
  },
};
