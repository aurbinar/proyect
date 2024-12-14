module.exports = {
    testEnvironment: 'node',
    verbose: true,
    transform: {    '^.+\\.m?js$': 'babel-jest',},
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testTimeout: 10000,
  };