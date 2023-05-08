const mongoose = require("mongoose");
const validator = require("validator");
const Termek = require("../models/termekModel");
const Felhasznalo = require("../models/felhasznaloModel");

const rendelesSchema = new mongoose.Schema({
  felhasznaloId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Felhasznalo",
    required: true,
  },
  termekIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Termek",
      required: true,
    },
  ],
  osszeg: {
    type: Number,
    require: true,
  },
  datum: {
    type: Date,
    default: Date.now,
  },
  fizetesMod: {
    type: String,
    enum: ["Készpénz", "Bankkártya", "Utalás"],
    default: "Bankkártya",
  },
  fizetve: {
    type: Boolean,
    default: true,
  },
});

rendelesSchema.pre(/^find/, function (next) {
  this.populate({
    path: "felhasznaloId",
    select: "-__v",
  }).populate({
    path: "felhasznaloId",
    select: "-__v -jelszoMegvaltoztatva",
  });
  next();
});

const Rendeles = mongoose.model("Rendeles", rendelesSchema, "Rendelesek");

module.exports = Rendeles;
