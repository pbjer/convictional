const express = require('express');
const { store } = require('./routes/store');
const { products } = require('./routes/products');
const { migrate } = require('./db/migrate.js');
const { handleSeedProcess } = require('./seed/index.js');
const { SOURCE_CONFIGS } = require('./seed/sources.js');

const port = process.env.CONVICTIONAL_SERVER_PORT;

(async function () {
  // Create tables and stored functions
  await migrate('src/db/sql');

  // Get product data from sources and populate database
  await handleSeedProcess(SOURCE_CONFIGS);

  // Initialize API and accept requests
  const app = express();

  app.use('/store', store);
  app.use('/products', products);

  app.listen(port, () => {
    console.log(`\nListening on port ${port}\n`);
  });
})();
