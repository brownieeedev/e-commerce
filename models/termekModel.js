const mongoose = require("mongoose");
const slugify = require("slugify");

//SCHEMA
const termekSchema = new mongoose.Schema({
  nev: { type: String, unique: true },
  meret: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] },
  slug: String,
  leiras: String,
  szin: String,
  kepek: [{ type: String }],
  raktaron: { type: Number, default: 0, required: true },
  beszallito: { type: String },
  beerkezesiAr: { type: Number },
  ar: { type: Number, required: true },
  feltoltesDatum: { type: Date, required: true, default: Date.now() },
});

//MONGOOSE PRE-POST
termekSchema.pre("save", function (next) {
  this.slug = slugify(this.nev, { lower: true });
  next();
});

termekSchema.post("save", async function (doc) {
  let filenames = [];
  for (let i = 0; i < doc.kepek.length; i++) {
    //új név mentése
    const ext = "." + doc.kepek[i].split(".")[1];
    const filename = doc._id + "-" + doc.kepek[i].split(".")[0] + ext;
    filenames.push(filename);
  }
  await Termek.findOneAndUpdate({ _id: doc._id }, { kepek: filenames });
});

//MODEL
const Termek = mongoose.model("Termek", termekSchema, "Termekek");
module.exports = Termek;
