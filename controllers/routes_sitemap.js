const User = require("../models/User");
const Products = require("../models/Products");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

exports.fetchDynamicRoutes = async (req, res) => {
  try {
    console.log("Generating sitemap...");

    // Static links
    const staticLinks = [
      { url: "/", changefreq: "weekly", priority: 0.9 },
      { url: "/login", changefreq: "weekly", priority: 0.6 },
      { url: "/about", changefreq: "monthly", priority: 0.5 },
      { url: "/terms", changefreq: "monthly", priority: 0.5 },
      { url: "/contact", changefreq: "monthly", priority: 0.5 },
      { url: "/employ", changefreq: "monthly", priority: 0.5 },
      { url: "/404", changefreq: "never", priority: 0.1 },
    ];

    // Fetch dynamic data
    const profiles = await User.find({}, { username: 1 });
    const products = await Products.find({}, { _id: 1 });

    // Generate dynamic links
    const profileLinks = profiles.map((profile) => ({
      url: `/profile/${profile.username}`,
      changefreq: "weekly",
      priority: 0.8,
    }));

    // const profileVisitorLinks = profiles.map((profile) => ({
    //   url: `/profileVisitor/${profile.username}`,
    //   changefreq: "weekly",
    //   priority: 0.8,
    // }));

    const productLinks = products.map((product) => ({
      url: `/product/${product._id}`,
      changefreq: "weekly",
      priority: 0.7,
    }));

    // const productVisitorLinks = products.map((product) => ({
    //   url: `/productVisitor/${product._id}`,
    //   changefreq: "weekly",
    //   priority: 0.7,
    // }));

    // Combine static and dynamic links
    const links = [
      ...staticLinks,
      ...profileLinks,
      // ...profileVisitorLinks,
      ...productLinks,
      // ...productVisitorLinks,
    ];

    // Generate sitemap
    const stream = new SitemapStream({ hostname: "https://empresy.com" });
    const pipeline = Readable.from(links).pipe(stream);

    const sitemap = await streamToPromise(pipeline).then((data) =>
      data.toString()
    );

    console.log("Sitemap generated successfully.");

    // Set response headers and send the sitemap
    res.header("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (err) {
    console.error("Error generating sitemap", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
