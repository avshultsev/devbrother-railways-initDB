const fs = require('fs').promises;
const path = require('path');
const promisifiedReq = require('./promisifiedReq');

const src = path.join(__dirname, 'csv', 'carriages.csv');
const s = ', '; // separator

const getOptions = (train, jsonData) => ({
  hostname: 'localhost',
  port: 3000,
  path: `/carriages?train=${train}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonData),
  }
});

const toPromise = obj => {
  const { train, ...payload } = obj;
  const json = JSON.stringify(payload);
  const options = getOptions(train, json);
  return promisifiedReq(options, json);
};

module.exports = async () => {
  const data = await fs.readFile(src, 'utf-8');
  const rows = data.split('\n');
  const carriages = [];
  for (let i = 1; i < rows.length; i++) {
    const [number, train, type, conductor1, conductor2] = rows[i].split(s);
    carriages.push({ number, train, type, conductor1, conductor2 });
  }
  const promises = carriages.map(toPromise);
  await Promise.all(promises);
  console.log('Carriages added!');
};