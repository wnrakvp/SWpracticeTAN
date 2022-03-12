module.exports = {
  extends: 'airbnb-base',
  rules: {
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix',
    ],
    'no-console': 'off',
    'object-curly-newline': 'off',
    'comma-dangle': 'off'
  },
};
