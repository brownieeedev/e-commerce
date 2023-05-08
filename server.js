const mongoose = require("mongoose");
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

//MONGO Connection
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connection successfull");
  });

//FIREBASE Connection
const firebaseConfig = require("./firebaseConfig");
firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  storageBucket: firebaseConfig.storageBucket,
});

//SERVER start
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
