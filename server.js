const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const { readdirSync } = require("fs");
const app = express();
// let allowed = ["http://localhost:3000", "some other link"];
// function options(req, res) {
// let tmp;
// let origin = req.header("Origin");
// if (allowed.indexOf(origin) > -1) {
//     tmp = {
//     origin: true,
//     optionSuccessStatus: 200,
//     };
// } else {
//     tmp = {
//     origin: stupid,
//     };
// }
// res(null, tmp);
// }
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' trusted.com");
  next();
});
//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//databases
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log("error connecting", err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Listening on port 8000");
});
