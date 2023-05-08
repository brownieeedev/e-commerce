const mongoose = require("mongoose");
const Felhasznalo = require("../models/felhasznaloModel");
const Termek = require("../models/termekModel");

const kosarSchema = new mongoose.Schema({
  felhasznaloId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Felhasznalo",
    required: true,
  },
  termekIds: [
    {
      termekId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Termek",
        required: true,
      },
      meret: {
        type: String,
        default: "meret",
      },
      darab: {
        type: Number,
        default: 1,
      },
    },
    { _id: false },
  ],
  datum: { type: Date, default: Date.now() },
});

const Kosar = new mongoose.model("Kosar", kosarSchema, "Kosar");

module.exports = Kosar;
