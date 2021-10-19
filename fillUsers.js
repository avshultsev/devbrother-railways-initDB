const fs = require('fs').promises;
const path = require('path');
const promisifiedReq = require('./promisifiedReq');

const src = path.join(__dirname, 'csv', 'users.csv');
const s = ', '; // separator

const getOptions = jsonData => ({
  hostname: 'localhost',
  port: 3000,
  path: '/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonData),
  }
});

const toPromise = obj => {
  const json = JSON.stringify(obj);
  const options = getOptions(json);
  return promisifiedReq(options, json);
};

module.exports = async () => {
  const data = await fs.readFile(src, 'utf-8');
  const rows = data.split('\n');
  const users = [];
  for (let i = 1; i < rows.length; i++) {
    const [email, password, role] = rows[i].split(s);
    users.push({ email, password, role });
  }
  const promises = users.map(toPromise);
  await Promise.all(promises);
  console.log('Users filled!');
};