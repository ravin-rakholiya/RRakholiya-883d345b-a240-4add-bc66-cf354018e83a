const path = require('path');

module.exports = (config) => {
  return {
    ...config,
    target: 'node',
    entry: path.join(__dirname, 'src/main.ts'),
    output: {
      path: path.join(__dirname, '../../dist/apps/api'),
      filename: 'main.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    externals: [],
  };
};
