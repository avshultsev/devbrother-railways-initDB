const fillUsers = require("./fillUsers");
const fillTrains = require("./fillTrains");
const fillCarriages = require("./fillCarriages");
const fillFreqs = require("./fillFreqs");
const fillSeats = require("./fillSeats");

fillUsers()
  .then(fillTrains)
  .then(fillCarriages)
  .then(fillFreqs)
  .then(fillSeats);