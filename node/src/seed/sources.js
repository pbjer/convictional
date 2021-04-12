const { mapperA } = require('./mappers.js');

const SOURCE_CONFIGS = [
  {
    url: 'https://my-json-server.typicode.com/convictional/engineering-interview/products',
    mappingFunction: mapperA,
  },
];

module.exports = {
  SOURCE_CONFIGS,
};
