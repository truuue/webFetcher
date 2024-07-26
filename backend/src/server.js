const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const urlModule = require("url");

const app = express();
const port = process.env.PORT || 5001;
const allowedOrigins = ["https://webfetcher.noahvernhet.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

app.get("/api", (req, res) => {
  res.send({ message: "Hello from the backend!" });
});

app.post("/api/data", (req, res) => {
  const { url } = req.body;
  console.log(url);
  res.send({ message: `You sent the url: ${url}` });
});

app.get("/fetch", async (req, res) => {
  const { url, fileType } = req.query;
  console.log(`Fetching from URL: ${url} with file type: ${fileType}`);

  if (!url) {
    return res.status(400).send({ message: "URL is required" });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (_) {
    return res.status(400).send({ message: "Invalid URL" });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const imgUrls = [];

    $("img").each((index, img) => {
      let src = $(img).attr("src");
      if (src) {
        if (!src.startsWith("http") && !src.startsWith("//")) {
          src = urlModule.resolve(url, src);
        }
        console.log(`Resolved image URL: ${src}`); // Log resolved URLs
        if (new RegExp(`\\.${fileType}$`, "i").test(src)) {
          imgUrls.push(src);
        }
      }
    });

    res.send({
      message: `Success! Number of items: ${imgUrls.length}`,
      imgUrls,
    });
  } catch (error) {
    if (error.response) {
      res
        .status(error.response.status)
        .send({ message: error.response.statusText });
    } else {
      res.status(500).send({
        message: "Error while fetching the URL.",
        error: error.message,
      });
    }
    console.error("Error!", error);
  }
});

// Nouvelle route proxy pour contourner les restrictions CORS
app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send({ message: "URL is required" });
  }

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];
    res.set("Content-Type", contentType);
    res.send(Buffer.from(response.data, "binary"));
  } catch (error) {
    res.status(500).send({
      message: "Error while fetching the URL.",
      error: error.message,
    });
    console.error("Error fetching image through proxy!", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
