const express = require('express');
const { query } = require('../db');

const store = express.Router();

store.get('/inventory', getInventory);

async function getInventory(req, res) {
  try {
    const queryString = 'select get_inventory() as result';
    const { rows } = await query(queryString);
    return res.status(200).json(rows[0].result);
  } catch (e) {
    console.error('getInventory', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { store };
