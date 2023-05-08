const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//SCHEMA
const felhasznaloSchema = new mongoose.Schema({
  nev: { type: String },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Adjon meg egy helyes formátú emailt!"],
    required: true,
  },
  lakcim: { type: String },
  telszam: { type: String },
  rendelesekSzama: { type: Number, default: 0 },
  regisztracioDatuma: { type: Date, required: true, default: Date.now() },
  jelszo: {
    type: String,
    minlength: [8, "Jelszó legalább 8 karaktert kell tartalmazzon!"],
    required: true,
    select: false,
  },
  jelszoMegerosites: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.jelszo;
      },
      message: "A jelszavak nem egyeznek",
    },
  },
  jelszoMegvaltoztatva: { type: Date },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  jelszoVisszaallitasToken: { type: String },
  jelszoVisszaallitasLejar: { type: Date },
});
//Mongoose PRE-POST

//jelszó enkriptálás új felirakozáskor
felhasznaloSchema.pre("save", async function (next) {
  if (!this.isModified("jelszo")) return next();
  this.jelszo = await bcrypt.hash(this.jelszo, 12);
  this.jelszoMegerosites = undefined;
  next();
});

//jelszó megváltoztatás idejének a beállítása?
felhasznaloSchema.pre("save", function (next) {
  if (!this.isModified("jelszo") || this.isNew) return next();
  this.jelszoMegvaltoztatva = Date.now() - 3000;
  next();
});

// aktiv felhasznalok listaza ??
felhasznaloSchema.pre(/^find/, function (next) {
  //this points to current query
  this.find({ active: { $ne: false } });
  next();
});

//jelszó ellenőrzése, bejelentkezéskor
felhasznaloSchema.methods.correctPassword = async function (
  Password,
  userPassword
) {
  return await bcrypt.compare(Password, userPassword);
};

//jelszó megváltoztatása
felhasznaloSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.jelszoMegvaltoztatva) {
    const jelszoMegvaltoztatva = parseInt(
      this.jelszoMegvaltoztatva.getTime() / 1000,
      10
    );
    //console.log(jelszoMegvaltoztatva, JWTTimeStamp);
    return JWTTimeStamp < jelszoMegvaltoztatva;
  }
  //False == nem lett megváltoztatva még a jelszó soha
  return false;
};

//jelszó visszaállító token küldése
felhasznaloSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.jelszoVisszaallitasToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.jelszoVisszaallitasLejar = Date.now() + 10 * 60 * 1000; //10perc

  return resetToken;
};

//MODELL
const Felhasznalo = mongoose.model(
  "Felhasznalo",
  felhasznaloSchema,
  "Felhasznalok"
);

module.exports = Felhasznalo;
