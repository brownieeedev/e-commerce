const express = require("express");
const Termek = require("../models/termekModel");
const APIFeatures = require("../utils/apiFeatures");
const multer = require("multer");
const sharp = require("sharp");
const admin = require("firebase-admin");

exports.getAllTermek = async (req, res, next) => {
  //EXECUTE query
  const features = new APIFeatures(Termek.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  //   const termekek = await features.query; //.explain(); -->indexes
  //   const allTermek = await Termek.find();
  //   const termekekLength = allTermek.length;
  //   const pages = Math.ceil(termekekLength / 30); //ceil(numberOfTermek/TermekPerPage);

  const termekek = await Termek.find();

  res.status(200).json({
    status: "success",
    results: termekek.length,
    termekek,
  });
};
exports.getTermek = async (req, res) => {
  const slug = req.params.slug;
  const termek = await Termek.find({ slug });
  res.status(200).json({
    status: "success",
    termek,
  });
};

const modifyBasedOnSize = (width, height) => {
  let x;
  if (width >= height && width >= 1000) {
    x = 1000 / width;
  } else if (width < height && height >= 1000) {
    x = 1000 / height;
  }
  return x;
};

//PICTURE UPLOAD
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, //30mb kicsit sok
});
exports.uploadPhoto = upload.array("file", 5);
exports.modifyPaintingPhoto = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  const photos = req.files.length;
  try {
    for (let i = 0; i < photos; i++) {
      const { width, height } = await sharp(req.files[i].buffer).metadata();
      const x = modifyBasedOnSize(width, height);
      if (typeof x !== "undefined") {
        const buffer = await sharp(req.files[i].buffer, {
          failOnError: false,
        })
          .toFormat("jpeg")
          .resize({
            width: Math.ceil(width * x),
            height: Math.ceil(height * x),
            withoutEnlargement: true,
          })
          .jpeg({ quality: 50 })
          .toBuffer();
        const size = await sharp(buffer).stats().size;
        if (size > 200000) {
          return res.send("Túl nagy fájl");
        }
        req.files[i].buffer = buffer;
      } else {
        const buffer = await sharp(req.files[i].buffer, {
          failOnError: false,
        })
          .toFormat("jpeg")
          .jpeg({ quality: 50 })
          .toBuffer();
        req.files[i].buffer = buffer;
      }
      next();
    }
  } catch (err) {
    return next(err);
  }
};

exports.createTermek = async (req, res, next) => {
  try {
    const photos = req.files;
    //processing images
    const processedBuffers = [];

    const bucket = admin.storage().bucket();
    let filenames = [];
    const uploadFilesToFirebase = async (photos) => {
      try {
        //tömb a filenevekből
        for (let i = 0; i < photos.length; i++) {
          const filename = `${Date.now()}-${i + 1}.jpg`;
          filenames.push(filename);
        }
        //kép mentése db-be
        const id = req.user.id;
        const newTermek = await new Termek({
          nev: req.body.nev,
          meret: req.body.meret,
          leiras: req.body.leiras,
          szin: req.body.szin,
          beszallito: req.body.beszallito,
          raktaron: req.body.raktaron,
          kepek: filenames,
          beerkezesiAr: req.body.beerkezesiAr,
          ar: req.body.ar,
          feltoltesDatum: req.body.feltoltesDatum,
        });
        try {
          await newTermek.save();
        } catch (err) {
          console.log(err);
        }
        res.status(201).json({
          status: "success",
          newTermek,
        });
        //fájlnevek módosítása
        const timestamp = filenames[0].split("-")[0];
        const query = {
          kepek: {
            $regex: new RegExp(`^.*-${timestamp}-.*\\.jpg$`),
          },
        };
        let picNames = [];
        Termek.find(query)
          .then(async (results) => {
            picNames = results.map(({ kepek }) => kepek).flat();
            //fájlnevek feltöltése firebase-re
            for (let i = 0; i < photos.length; i++) {
              const filePath = `images/${picNames[i]}`;
              const fileRef = bucket.file(filePath);
              await fileRef.save(photos[i].buffer, {
                contentType: "image/jpeg",
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (error) {
        console.error(error);
      }
    };
    uploadFilesToFirebase(photos);
  } catch (err) {
    console.log(err);
    res.status(500).send("Nem sikerült létrehozni a festményt!");
  }
};

exports.updateTermek = async (req, res, next) => {
  const raktarban = await Termek.findOne({
    $and: [
      { nev: req.body.nev },
      { meret: req.body.meret },
      { szin: req.body.szin },
    ],
  });
  if (raktarban) {
    const db = raktarban.raktaron * 1;
    const termek = await Termek.findOneAndUpdate(
      {
        $and: [
          { nev: req.body.nev },
          { meret: req.body.meret },
          { szin: req.body.szin },
        ],
      },
      { $set: { raktaron: db + req.body.raktaron * 1 } },
      { new: true }
    );
    if (!termek) {
      res.status(404).json({
        status: "not found",
      });
    } else {
      res.status(200).json({
        status: "success",
      });
    }
  }
  res.status(404).json({
    status: "not found",
  });
};
