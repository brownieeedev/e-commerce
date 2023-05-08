const Felhasznalo = require("../models/felhasznaloModel");
const Termek = require("../models/termekModel");
const Rendeles = require("../models/rendelesModel");
const Beszallito = require("../models/beszallitoModel");
const admin = require("firebase-admin");
const Kosar = require("../models/kosarModel");
const mongoose = require("mongoose");

exports.getIndex = (req, res) => {
  const currentPage = "index";
  res.status(200).render("index", {
    currentPage,
  });
};

exports.getLogin = (req, res) => {
  const currentPage = "login";
  res.status(200).render("login", {
    currentPage,
  });
};
exports.getSignUp = (req, res) => {
  const currentPage = "signup";
  res.status(200).render("signup", {
    currentPage,
  });
};

exports.getMe = (req, res) => {
  const currentPage = "me";
  res.status(200).render("account", {
    currentPage,
  });
};

exports.getCart = async (req, res, next) => {
  const currentPage = "cart";
  const kosar = await Kosar.findOne({ felhasznaloId: req.user.id });

  let termekek = [];
  if (!kosar) {
    return res.status(200).render("cart", {
      currentPage,
      termekek,
    });
  }
  let sum = 0;
  for (let i = 0; i < kosar.termekIds.length; i++) {
    const termek = await Termek.findOne({ _id: kosar.termekIds[i].termekId });
    const meret = kosar.termekIds[i].meret;
    const darab = kosar.termekIds[i].darab;
    const reszosszeg = darab * termek.ar;
    sum += darab * termek.ar;
    termekek.push({
      ...termek.toObject(),
      meret,
      darab,
      reszosszeg,
    });
  }

  //2) Get filePaths to pictures
  const bucket = admin.storage().bucket();

  for (let i = 0; i < termekek.length; i++) {
    const kep = termekek[i].kepek[0];
    if (kep.split(".")[1] === "jpg") {
      const [imageURL] = await bucket.file(`images/${kep}`).getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 24 * 7 * 60 * 60 * 1000,
      });
      termekek[i].kepek[0] = imageURL;
    }
  }
  const afa = Math.ceil(sum * 0.27);
  const reszosszeg = Math.ceil(sum - afa);
  res.status(200).render("cart", {
    currentPage,
    termekek,
    sum,
    reszosszeg,
    afa,
  });
};

exports.getTermekek = async (req, res, next) => {
  const termekek = await Termek.find();
  const currentPage = "termekek";

  //2) Get filePaths to pictures
  const bucket = admin.storage().bucket();
  const termekekWithUrl = await Promise.all(
    termekek.map(async (termek) => {
      const imageURLs = await Promise.all(
        termek.kepek.map(async (kepek) => {
          const [imageURL] = await bucket.file(`images/${kepek}`).getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 60 * 60 * 1000, // 1 hour
          });
          return imageURL;
        })
      );
      const termekWithImageURL = {
        ...termek.toObject(),
        imageURL: imageURLs,
      };
      return termekWithImageURL;
    })
  );
  res.status(200).render("termekek", {
    termekek: termekekWithUrl,
    currentPage,
  });
};

exports.getAddPage = (req, res) => {
  const currentPage = "add";
  res.status(200).render("add", {
    currentPage,
  });
};

exports.getTermekFeltoltes = (req, res) => {
  const currentPage = "termekFeltoltes";
  res.status(200).render("termekFeltoltes", {
    currentPage,
  });
};

exports.getFelhasznalok = async (req, res) => {
  const currentPage = "felhasznalok";
  const felhasznalok = await Felhasznalo.find({ role: "user" });
  res.status(200).render("felhasznalok", {
    currentPage,
    felhasznalok,
  });
};
exports.getRendelesek = async (req, res) => {
  const currentPage = "rendelesek";
  const rendelesek = await Rendeles.find();
  res.status(200).render("rendelesek", {
    currentPage,
    rendelesek,
  });
};

exports.getBeszallitok = async (req, res) => {
  const currentPage = "beszallitok";
  const beszallitok = await Beszallito.find();
  res.status(200).render("beszallitok", {
    currentPage,
    beszallitok,
  });
};

exports.getDetails = async (req, res, next) => {
  const currentPage = "details";
  const slug = req.params.slug;
  const termek = await Termek.findOne({ slug });

  if (!termek) {
    res.status(404).send("Nincs ilyen termék");
    return next();
  }
  //get store picture urls
  const bucket = admin.storage().bucket();

  const imageURLs = await Promise.all(
    termek.kepek.map(async (kepek) => {
      const [imageURL] = await bucket.file(`images/${kepek}`).getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });
      return imageURL;
    })
  );
  const termekWithImageURL = {
    ...termek.toObject(),
    imageURL: imageURLs,
  };

  res.status(200).render("details", {
    currentPage,
    termek: termekWithImageURL,
  });
};

exports.getTermekAttekintes = async (req, res) => {
  const currentPage = "termekAttekintes";
  const termekek = await Termek.find();
  res.status(200).render("termekAttekintes", {
    currentPage,
    termekek,
  });
};
