module.exports = function(wallaby) {
  var path = require('path');
  process.env.NODE_PATH =
    path.join(__dirname, '../node_modules') + path.delimiter + path.join(__dirname, 'node_modules');

  return {
    files: [
      'mocha.config.js',
      'package.json',
      'tsconfig.json',
      'src/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg|graphql)',
      '!src/**/*.test.+(ts|tsx)'
    ],
    filesWithNoCoverageCalculated: [],
    tests: [
      //'src/client/modules/form/**/checkbox_view.test.+(ts|tsx)',
      'src/**/*.test.+(ts|tsx)'
    ],

    env: {
      type: 'node',
      runner: 'node',
      params: {
        // runner: '--async-stack-traces'
      }
    },
    workers: {
      initial: 1,
      regular: 1
    },
    testFramework: 'mocha',
    setup(wallaby) {
      require('./mocha.config.js');
      require('mocha-jest-snapshots').patch(wallaby);
    }
  };
};
