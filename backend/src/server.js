const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const urlModule = require("url");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;
const allowedOrigins = ["https://webfetcher.noahvernhet.com"];
const tempDir = path.join(__dirname, "temp_images");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

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
        console.log(`Resolved image URL: ${src}`);
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

app.get("/download-image", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    console.log("No URL provided");
    return res.status(400).send("URL parameter is required");
  }

  try {
    console.log(`Fetching image from URL: ${url}`);
    const response = await axios.get(url, { responseType: "arraybuffer" });
    console.log(
      `Received response with content-type: ${response.headers["content-type"]}`
    );

    const contentType = response.headers["content-type"];
    if (!contentType.startsWith("image/")) {
      console.log("Received non-image content");
      return res.status(400).send("Received non-image content");
    }

    const fileName = path.basename(new URL(url).pathname);
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, response.data);

    res.sendFile(filePath, { root: __dirname });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
