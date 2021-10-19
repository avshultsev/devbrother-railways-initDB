const fs = require("fs").promises;
const path = require("path");
const promisifiedReq = require('./promisifiedReq');

const src = path.join(__dirname, "csv", "freqs.csv");
const s = ", "; // separator

const getOptions = (train, jsonData) => ({
  hostname: 'localhost',
  port: 3000,
  path: `/train-frequencies?train=${train}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonData),
  }
});

const toPromise = obj => {
  const { frequencyName } = obj;
  const json = JSON.stringify({ frequencyName });
  const options = getOptions(obj.train, json);
  return promisifiedReq(options, json);
};

module.exports = async () => {
  const data = await fs.readFile(src, "utf-8");
  const rows = data.split('\n');
  const freqs = [];
  for (let i = 1; i < rows.length; i++) {
    const [train, frequencyName] = rows[i].split(s);
    freqs.push({ train, frequencyName});
  }
  const promises = freqs.map(toPromise);
  await Promise.all(promises);
  console.log('Freqs added!');
};