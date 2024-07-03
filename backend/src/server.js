// backend/src/server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

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
  const { url } = req.query;
  console.log(url);

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const imgUrls = [];
    $("img").each((index, img) => {
      imgUrls.push($(img).attr("src"));
    });

    res.send({ message: "Success!", imgUrls });
  } catch (error) {
    res.status(500).send({ message: "Error while fetching the url.", error });
    console.error("Error!", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
