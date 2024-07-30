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
const tempDir = path.join(__dirname, "temp");

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
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
  console.log(`Received request to download image: ${url}`);

  if (!url) {
    return res.status(400).send("URL parameter is required");
  }

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];
    console.log(`Fetched content type: ${contentType}`);

    if (!contentType.startsWith("image/")) {
      console.log(`Received non-image content for URL: ${url}`);
      return res.status(400).send("Received non-image content");
    }

    const fileExtension = path.extname(url);
    const filename = `image_${Date.now()}${fileExtension}`;
    const filePath = path.join(tempDir, filename);

    fs.writeFileSync(filePath, response.data);

    console.log(`Image saved at: ${filePath}`);
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending file:", err.message);
      }
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting file ${filePath}:`, unlinkErr);
        } else {
          console.log(`Successfully deleted file ${filePath}`);
        }
      });
    });
  } catch (error) {
    console.error(`Error downloading image from URL ${url}:`, error.message);
    res.status(500).send("Error downloading image");
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
