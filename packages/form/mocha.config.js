// compile only with transpilation as this will most probably fail with addTest
require('ts-node/register/transpile-only');

// register add test
// require('luis/mocha/register');

// use jest expect function with mocha
// you can use chai or whatever you decide
global.expect = require('chai').expect;

// add sinon-chai
var sinonChai = require('sinon-chai');
var chai = require('chai');
chai.use(sinonChai);

// this is an example of how to add snapshots
require('mocha-jest-snapshots');
