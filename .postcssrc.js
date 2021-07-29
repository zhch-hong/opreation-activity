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
      propList: ['*'],
      // selectorBlackList: [/^(?!\.van-(divider|button))/],
      include: /\/src\//,
      landscapeWidth: 1080,
    },
  },
};
