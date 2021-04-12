const express = require('express');
const { query } = require('../db');

const products = express.Router();

products.get('/', getAllProducts);
products.get('/:productId', validateProductId, getProductById);

async function getAllProducts(req, res) {
  try {
    const queryString = 'select get_all_products() as result';
    const { rows } = await query(queryString);
    if (rows[0].result === null) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(rows[0].result);
  } catch (e) {
    console.error('getAllProducts', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getProductById(req, res) {
  try {
    const { productId } = req.params;
    const queryString = 'select get_product_by_id($1) as result';
    const values = [productId];
    const { rows } = await query(queryString, values);
    if (rows[0].result === null) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(rows[0].result);
  } catch (e) {
    console.error('getProductById', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function validateProductId(req, res, next) {
  try {
    const { productId } = req.params;

    // Since req.params are string types,
    // this will throw an error if productId
    // can't be evaluated as a valid integer.
    const n = BigInt(productId);

    const min = BigInt('-9223372036854775808');
    const max = BigInt('9223372036854775807');
    if (n < min || n > max) {
      throw 'Not int64';
    }
    next();
  } catch (e) {
    return res.status(400).json({ message: 'Invalid ID supplied' });
  }
}

module.exports = {
  products,
  validateProductId,
};
