const fs = require("fs").promises;
const path = require("path");
const promisifiedReq = require('./promisifiedReq');

const src = path.join(__dirname, "csv", "trains.csv");
const s = ", "; // separator

const getOptions = jsonData => ({
  hostname: 'localhost',
  port: 3000,
  path: '/trains',
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
  const data = await fs.readFile(src, "utf-8");
  const rows = data.split('\n');
  const trains = [];
  for (let i = 1; i < rows.length; i++) {
    const [number, type, departureTime, route, lead, machenist, machenistAssistant] = rows[i].split(s);
    const train = { number, type, departureTime, route, lead, machenist, machenistAssistant };
    trains.push(train);
  }
  const promises = trains.map(toPromise);
  await Promise.all(promises);
  console.log('Trains added!');
};