process.env.NODE_ENV = 'test';
// compile only with transpilation as this will most probably fail with addTest
require('ts-node/register/transpile-only');

// register add test
// require('luis/mocha/register');

// use jest expect function with mocha
// you can use chai or whatever you decide
global.expect = require('chai').expect;

// add sinon-chai
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chai = require('chai');
chai.use(sinonChai);

global.mock = {
  fake: sinon.fake
};

// this is an example of how to add snapshots
require('mocha-jest-snapshots');

function noop() {
  return null;
}

require.extensions['.styl'] = noop;
// you can add whatever you wanna handle
require.extensions['.scss'] = noop;
require.extensions['.png'] = noop;
require.extensions['.css'] = noop;

global.localStorage = {
  getItem() {
    return null;
  }
};
