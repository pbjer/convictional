const axios = require('axios');
const { query } = require('../db');

function mappingExample(product) {
  let mappedProduct = {
    id: product.id,
    title: product.title,
    vendor: product.vendor,
    bodyHtml: product.body_html,
  };

  let mappedVariants = [];
  let mappedImages = [];

  product.variants.forEach((v) => {
    mappedVariants.push({
      id: v.id,
      productId: v.product_id,
      title: v.title,
      sku: v.sku,
      inventoryQuantity: 0,
      weightValue: v.weight,
      weightUnit: v.weight_unit,
    });

    v.images.forEach((i) => {
      mappedImages.push({
        variantId: v.id,
        source: i.src,
      });
    });
  });

  return {
    product: mappedProduct,
    variants: mappedVariants,
    images: mappedImages,
  };
}

const SOURCE_CONFIGS = [
  {
    url: 'https://my-json-server.typicode.com/convictional/engineering-interview/products',
    mappingFunction: mappingExample,
  },
];

async function handleSeedProcess(configs) {
  try {
    // Support concurrent API requests to GET product data.
    const requestPromises = configs.map(async (c) => {
      const response = await axios.get(c.url);
      return {
        products: response.data,
        mappingFunction: c.mappingFunction,
      };
    });

    const requestResults = await Promise.allSettled(requestPromises);

    // Support concurrent database queries to SET product data.
    let dbPromises = [];

    requestResults.forEach((r) => {
      const { status, value } = r;

      if (status === 'fulfilled') {
        const { products, mappingFunction } = value;

        products.forEach((p) => {
          const mappedProduct = mappingFunction(p);
          dbPromises.push(seedDatabase(mappedProduct));
        });
      }
    });

    await Promise.allSettled(dbPromises);
  } catch (e) {
    console.error('runSeedProcess', e);
  }
}

async function seedDatabase({ product, variants, images }) {
  // Foreign key constraints require queries be completed
  // in this order, or else you risk trying to add a record
  // before it's foreign relation has been persisted.
  await addProduct(product);
  await Promise.allSettled(variants.map((v) => addVariant(v)));
  await Promise.allSettled(images.map((i) => addImage(i)));
}

async function addProduct({ id, title, vendor, bodyHtml }) {
  try {
    const queryString = 'select add_product($1, $2, $3, $4) as result';
    const values = [id, title, vendor, bodyHtml];
    await query(queryString, values);
  } catch (e) {
    console.error('addProduct', e);
  }
}

async function addVariant({ id, productId, title, sku, inventoryQuantity, weightValue, weightUnit }) {
  try {
    const queryString = 'select add_variant($1, $2, $3, $4, $5, $6, $7) as result';
    const values = [id, productId, title, sku, inventoryQuantity, weightValue, weightUnit];
    await query(queryString, values);
  } catch (e) {
    console.error('addVariant', e);
  }
}

async function addImage({ variantId, source }) {
  try {
    const queryString = 'select add_image($1, $2) as result';
    const values = [variantId, source];
    await query(queryString, values);
  } catch (e) {
    console.error('addImage', e);
  }
}

module.exports = { SOURCE_CONFIGS, handleSeedProcess };
