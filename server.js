const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const EventEmitter = require("events");
const { Actions } = require("./SocketServer");
dotenv.config();
const { readdirSync } = require("fs");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const { Server } = require("socket.io");
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
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(20);
//parse json request url
app.use(express.json());
//parse json request body
app.use(express.urlencoded({ extended: true }));
//mongo request sanitizer
app.use(mongoSanitize());
//Enable cookie parser
app.use(cookieParser());
//gzip compression
app.use(compression());
//gzip compression
app.use(compression());
//cors
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(helmet());
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
let server;

server = app.listen(PORT, () => {
  console.log("Listening on port 8000");
});

// socket io
const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    origin: process.env.BASE_URL,
  },
});

io.on("connection", (socket) => {
  console.log("socket conected!");
  Actions(socket, io);
});
