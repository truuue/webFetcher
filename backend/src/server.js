const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const urlModule = require("url");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Route pour la racine
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Route pour /api
app.get("/api", (req, res) => {
  res.send({ message: "Hello from the backend!" });
});

// Route pour /api/data
app.post("/api/data", (req, res) => {
  const { url } = req.body;
  console.log(url);
  res.send({ message: `You sent the url: ${url}` });
});

// Route pour /fetch
app.get("/fetch", async (req, res) => {
  const { url, fileType } = req.query;
  console.log(`Fetching from URL: ${url} with file type: ${fileType}`);

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const imgUrls = [];
    $("img").each((index, img) => {
      let src = $(img).attr("src");
      if (src) {
        // Check if the URL is relative
        if (!src.startsWith("http") && !src.startsWith("//")) {
          // Resolve the relative URL to an absolute URL
          src = urlModule.resolve(url, src);
        }
        // Check if the URL ends with the specified file type
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
    res.status(500).send({ message: "Error while fetching the url.", error });
    console.error("Error!", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
