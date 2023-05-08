const mongoose = require("mongoose");

const beszallitoSchema = new mongoose.Schema({
  nev: { type: String, required: true },
  email: { type: String, required: true },
  telszam: { type: String },
});

const Beszallito = new mongoose.model(
  "Beszallito",
  beszallitoSchema,
  "Beszallitok"
);
module.exports = Beszallito;
