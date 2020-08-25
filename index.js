const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");

const URL = "https://myinstants.com";

const api = axios.create({
  baseURL: URL,
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/busca", async (req, res) => {
  const { name } = req.query;
  try {
    const { data } = await api.get("/search", {
      params: {
        name,
      },
    });

    const $ = cheerio.load(data);

    let array = [];

    $(".instant").each((index, element) => {
      const title = $(element).text();
      const link = $(element).children(".small-button").attr("onmousedown");
      const [, linked] = link.split(`play('`);
      const [finalink] = linked.split(`')`);

      const item = {
        title,
        link: `${URL}${finalink}`,
      };

      array[index] = item;
    });
    return res.status(200).json(array);
  } catch (error) {
    return res.status(404).json({ error });
  }
});

app.listen(3333, console.log("Tudo Certo!"));
