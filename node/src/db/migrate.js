const fs = require('fs');
const path = require('path');

const { readdir } = require('fs').promises;
const { query } = require('./index.js');

async function migrate(dir) {
  const route = path.resolve(process.cwd(), dir);
  const dirents = await readdir(route, { withFileTypes: true });
  for (const dirent of dirents) {
    console.log(`\nRunning migration - ${dirent.name}`);
    await runSqlFromFile(route + '/' + dirent.name);
  }
}

async function runSqlFromFile(file) {
  const queryString = fs.readFileSync(file).toString();
  try {
    const result = await query(queryString);
    return result;
  } catch (e) {
    console.log(e);
  }
}

module.exports = { migrate };
