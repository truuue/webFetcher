const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const urlModule = require("url");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

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
      res
        .status(500)
        .send({
          message: "Error while fetching the URL.",
          error: error.message,
        });
    }
    console.error("Error!", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
