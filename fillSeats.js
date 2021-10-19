const fs = require('fs').promises;
const path = require('path');
const promisifiedReq = require('./promisifiedReq');

const src = path.join(__dirname, 'csv', 'carriages.csv');
const s = ', '; // separator

const CAPACITY = {
  SV: 10, 
  COMPARTMENT: 15, 
  ECONOM: 20, 
  SITTING: 30,
};

const getOptions = (train, carriage, jsonData) => ({
  hostname: 'localhost',
  port: 3000,
  path: `/seats?trainNumber=${train}&carriageNumber=${carriage}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonData),
  }
});

const toPromise = obj => {
  const { train, carriage, ...payload } = obj;
  const json = JSON.stringify(payload);
  const options = getOptions(train, carriage, json);
  return promisifiedReq(options, json);
};

const partialApply = async (seatsForCarriage = []) => {
  const seats = seatsForCarriage.splice(0, 5);
  const promises = seats.map(toPromise);
  await Promise.all(promises);
  if (seatsForCarriage.length) await partialApply(seatsForCarriage);
}

const createSeats = async (seats) => {
  const seatsForCarriage = seats.shift();
  await partialApply(seatsForCarriage);
  if (seats.length) await createSeats(seats);
};

(async () => {
  const data = await fs.readFile(src, 'utf-8');
  const rows = data.split('\n');
  const seats = [];
  for (let i = 1; i < rows.length; i++) {
    const [carriage, train, type] = rows[i].split(s);
    const capacity = CAPACITY[type];
    const seatsForCarriage = [];
    for (let seatNumber = 1; seatNumber <= capacity; seatNumber++) {
      seatsForCarriage.push({ train, carriage, seatNumber });
    }
    seats.push(seatsForCarriage);
  }
  createSeats(seats);
})();
