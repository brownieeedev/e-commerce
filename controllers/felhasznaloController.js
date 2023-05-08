const app = require("../app");
const Felhasznalo = require("../models/felhasznaloModel"); //azért ír errort, mert át lett nevezve a mappa

exports.getAllUsers = async (req, res, next) => {
  console.log("hit the route");
  const users = await Felhasznalo.find();
  console.log(users);
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};

exports.createUser = async (req, res, next) => {
  const newUser = await Felhasznalo.create(req.body);
  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
};

exports.updateMe = async (req, res, next) => {
  //1) error if user post password data
  if (req.body.jelszo || req.body.jelszoMegerosites) {
    res.status(400).send("This route is not for password updates!");
  }
  //2) only fields that needs to be updated
  const nev = req.body.nev;
  const email = req.body.email;
  //3) update user document
  let updatedUser = await Felhasznalo.findByIdAndUpdate(
    req.user.id,
    { nev },
    {
      new: true,
      runValidators: true,
    }
  );
  updatedUser = await Felhasznalo.findByIdAndUpdate(
    req.user.id,
    { email },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
};
