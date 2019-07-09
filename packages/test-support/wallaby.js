module.exports = function() {
  var path = require('path');
  process.env.NODE_PATH =
    path.join(__dirname, '../node_modules') + path.delimiter + path.join(__dirname, 'node_modules');

  return {
    files: [
      'mocha.config.js',
      'package.json',
      'tsconfig.json',
      'src/**/*.+(js|jsx|ts|tsx|json|snap|less|sass|scss|jpg|jpeg|gif|png|svg|graphql)',
      '!src/**/*.test.+(ts|tsx)'
    ],
    filesWithNoCoverageCalculated: [],
    tests: ['src/**/*.test.+(ts|tsx)'],

    env: {
      type: 'node',
      runner: 'node'
    },
    workers: {
      initial: 1,
      regular: 1,
      recycle: false
    },
    testFramework: 'mocha',
    setup(wallaby) {
      require('./mocha.config.js');

      process.env.JEST_ROOT_OUTPUT_PATH = require('path').resolve(
        '/Users/tomi/Github/apps/interfaces/dynamic-form-semantic-ui/src'
      );

      require('mocha-jest-snapshots').patch(wallaby);
    }
  };
};
