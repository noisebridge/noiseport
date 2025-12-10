module.exports = {
  testMatch: ['**/__tests__/**/*.test.js'],
  testTimeout: 120000,
  verbose: true,
  transformIgnorePatterns: [
    'node_modules/(?!(pixelmatch)/)'
  ]
};
