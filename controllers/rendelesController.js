//const express = require('express');
const Rendeles = require("../models/rendelesModel");
const Termek = require("../models/termekModel");
const Kosar = require("../models/kosarModel");
const APIFeatures = require("../utils/apiFeatures");
const app = require("../app");
const process = require("process");
const mongoose = require("mongoose");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const { store } = require("../utils/mongoStore");

exports.getCheckoutSession = async (req, res, next) => {
  //1) get the painting/paintings?
  const sum = req.params.sum * 1;
  const painting = await Painting.findOne({ cim: "Koi" });

  //2) create session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/?festmenyId=${
      painting.id
    }&felhasznaloId=${req.user.id}&osszeg=${sum}`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    // client_reference_id: painting.id,
    line_items: [
      {
        price_data: {
          currency: "huf",
          product_data: {
            name: "Végösszeg",
          },
          unit_amount: sum * 100,
        },
        quantity: 1,
      },
    ],
  });
  //Sending response
  res.status(200).json({
    status: "success",
    sessionId: session.id,
    session,
  });
};

exports.createRendelesCheckout = async (req, res, next) => {
  //kezdetleges megoldás mentésre, nem biztonságos rendelés mentés, mert fel lehetne vinni rendelést fizetés nélkül
  const { festmenyId, felhasznaloId, osszeg } = req.query;
  if (!festmenyId && !felhasznaloId && !osszeg) return next();
  await Rendeles.create({ festmenyId, felhasznaloId, osszeg });

  res.redirect(req.originalUrl.split("?")[0]);
};

exports.getCart = async (req, res) => {
  console.log("getcart");
  const kosar = await Kosar.findOne({ felhasznaloId: req.user.id });
  res.status(200).json({
    status: "success",
    kosar,
  });
};

exports.removeFromCart = async (req, res) => {
  const kosar = await Kosar.findOne({ felhasznaloId: req.user.id });
  const id = req.params.id;

  const newKosar = await Kosar.findByIdAndUpdate(
    { _id: kosar._id },
    {
      $pull: { termekIds: { termekId: id } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    newKosar,
  });
};
exports.saveToCart = async (req, res) => {
  const length = req.body[0].termek.length;
  let termekek = [];
  for (let i = 0; i < length; i++) {
    const termek = await Termek.findOne({ nev: req.body[0].termek[i] });
    termekek.push({
      termek: termek._id,
      darab: req.body[0].darab[i],
      meret: req.body[0].meret[i],
    });
  }
  const kosar = await Kosar.findOneAndUpdate(
    { felhasznaloId: req.user.id },
    { termekIds: termekek },
    { new: true }
  );
};

exports.addToCart = async (req, res) => {
  const slug = req.params.slug;
  const termek = await Termek.findOne({ slug: slug });

  console.log(req.body.db);
  console.log(req.body.meret);

  let kosar = await Kosar.findOne({ felhasznaloId: req.user.id });
  console.log(kosar);

  if (kosar == null) {
    const newKosar = await Kosar.create({
      felhasznaloId: req.user.id,
      termekIds: {
        termekId: termek.id,
        meret: req.body.meret,
        darab: req.body.db,
      },
    });
  } else {
    const id = new mongoose.Types.ObjectId(termek.id);
    let itemFound = false;
    for (let i = 0; kosar.termekIds.length > i; i++) {
      if (!kosar.termekIds[i].termekId.toString() === id.toString()) {
        kosar.termekIds[i].meret = req.body.meret;
        kosar.termekIds[i].darab = req.body.db;
        await kosar.save({ runValidators: true });
        itemFound = true;
        break;
      }
    }
    if (!itemFound) {
      kosar.termekIds.push({
        termekId: termek.id,
        meret: req.body.meret,
        darab: req.body.db,
      });
      await kosar.save({ runValidators: true });
    }
  }
  res.status(200).json({
    status: "success",
  });
};

// //GET
// exports.getAllRendeles = catchAsync(async (req, res, next) => {
//   //EXECUTE query
//   const features = new APIFeatures(Rendeles.find(), req.query)
//     .filter()
//     .sort()
//     .limit()
//     .pagination();

//   const rendelesek = await features.query;

//   res.status(200).json({
//     status: "success",
//     results: rendelesek.length,
//     data: {
//       rendelesek,
//     },
//   });
// });
// //POST
// exports.createRendeles = catchAsync(async (req, res, next) => {
//   const newRendeles = await Rendeles.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: { rendeles: newRendeles },
//   });
// });

// //GET by ID
// exports.getRendeles = catchAsync(async (req, res, next) => {
//   const rendeles = await Rendeles.findById(req.params.id);
//   res.status(200).json({
//     status: "success",
//     data: {
//       rendeles,
//     },
//   });
// });

// //PATCH
// exports.updateRendeles = catchAsync(async (req, res, next) => {
//   const rendeles = await Rendeles.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   res.status(200).json({
//     status: "succes",
//     rendeles,
//   });
// });

// //DELETE
// exports.deleteRendeles = catchAsync(async (req, res, next) => {
//   await Rendeles.findByIdAndDelete(req.params.id);
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });
