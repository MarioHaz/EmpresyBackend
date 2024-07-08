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
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const { Readable } = require("stream");
const Products = require("./models/Products");
const User = require("./models/User");
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
  cors: {},
});

io.on("connection", (socket) => {
  console.log("socket conected!");
  Actions(socket, io);
});

// // Sitemap Generation
// let sitemap;
// const generateSitemap = async () => {
//   try {
//     console.log("Generating sitemap...");

//     // Static links
//     const staticLinks = [
//       { url: "/", changefreq: "weekly", priority: 0.9 },
//       { url: "/login", changefreq: "weekly", priority: 0.6 },
//       { url: "/about", changefreq: "monthly", priority: 0.5 },
//       { url: "/terms", changefreq: "monthly", priority: 0.5 },
//       { url: "/contact", changefreq: "monthly", priority: 0.5 },
//       { url: "/employ", changefreq: "monthly", priority: 0.5 },
//       { url: "/404", changefreq: "never", priority: 0.1 },
//     ];

//     // Fetch dynamic data
//     const profiles = await User.find({}, { username: 1 }); // Adjust as necessary for your User model
//     const products = await Products.find({}, { _id: 1 });

//     // Generate dynamic links
//     const profileLinks = profiles.map((profile) => ({
//       url: `/profile/${profile.username}`,
//       changefreq: "weekly",
//       priority: 0.8,
//     }));

//     const profileVisitorLinks = profiles.map((profile) => ({
//       url: `/profileVisitor/${profile.username}`,
//       changefreq: "weekly",
//       priority: 0.8,
//     }));

//     const productLinks = products.map((product) => ({
//       url: `/product/${product._id}`,
//       changefreq: "weekly",
//       priority: 0.7,
//     }));

//     const productVisitorLinks = products.map((product) => ({
//       url: `/productVisitor/${product._id}`,
//       changefreq: "weekly",
//       priority: 0.7,
//     }));

//     // Combine static and dynamic links
//     const links = [
//       ...staticLinks,
//       ...profileLinks,
//       ...profileVisitorLinks,
//       ...productLinks,
//       ...productVisitorLinks,
//     ];

//     // Generate sitemap
//     const stream = new SitemapStream({ hostname: "https://empresy.com" });
//     const pipeline = Readable.from(links).pipe(stream).pipe(createGzip());

//     sitemap = await streamToPromise(pipeline).then((data) => data.toString());
//     console.log("Sitemap generated successfully.");
//   } catch (err) {
//     console.error("Error generating sitemap", err);
//   }
// };

// // Run sitemap generation periodically (every hour)
// setInterval(generateSitemap, 3600000);

// // Serve sitemap.xml
// app.get("/sitemap.xml", (req, res) => {
//   res.header("Content-Type", "application/xml");
//   res.header("Content-Encoding", "gzip");
//   // if we have a cached entry send it
//   if (sitemap) {
//     res.send(sitemap);
//     return;
//   }
//   res.status(500).send("Sitemap not generated yet.");
// });

// // Initial sitemap generation
// generateSitemap();
