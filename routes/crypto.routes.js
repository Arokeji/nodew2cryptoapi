const express = require("express");
const { deleteAndInsertCryptos } = require("../seeds/cryptos.seed.aux.js");

// Router de Crypto
const router = express.Router();

// Modelos
const { Crypto } = require("../models/Crypto.js");

// Rutas

// CRUD: Read por price range
// Ejemplo de request con parametros http://localhost:3000/crypto/price-range?min=10&max=1000
router.get("/price-range/", async (req, res) => {
  // Lectura de parameters
  const min = parseInt(req.query.min);
  const max = parseInt(req.query.max);

  if (max <= min || min >= max) {
    res.status(500).json("Los rangos minimos y maximos son incorrectos.");
  } else {
    try {
      const cryptos = await Crypto.find({ price: { $gt: min, $lt: max } });
      if (cryptos) {
        res.json(cryptos);
      } else {
        res.status(400).json("No hay cryptos en este rango");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

// CRUD: Read por marketCap ordenado
// Ejemplo de request con parametros http://localhost:3000/crypto/sorted-by-marketCap/?order=desc o asc
router.get("/sorted-by-marketcap/", async (req, res) => {
  // Lectura de parameters
  const order = req.query.order;
  try {
    if (order === "asc") {
      try {
        const cryptos = await Crypto.find().sort({ marketCap: 1 });
        res.json(cryptos);
      } catch (error) {
        res.status(500).json(error);
      }
    } else if (order === "desc") {
      try {
        const cryptos = await Crypto.find().sort({ marketCap: -1 });
        res.json(cryptos);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(400).json("Parametros incorrectos");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// CRUD: Read por date ordenado
// Ejemplo de request con parametros http://localhost:3000/crypto/sorted-by-date/?order=desc o asc
router.get("/sorted-by-date/", async (req, res) => {
  // Lectura de parameters
  const order = req.query.order;
  try {
    if (order === "asc") {
      try {
        const cryptos = await Crypto.find().sort({ created_at: 1 });
        res.json(cryptos);
      } catch (error) {
        res.status(500).json(error);
      }
    } else if (order === "desc") {
      try {
        const cryptos = await Crypto.find().sort({ created_at: -1 });
        res.json(cryptos);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(400).json("Parametros incorrectos");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// CRUD: Read a CSV
router.get("/csv", async (req, res) => {
  try {
    const cryptos = await Crypto.find().select("name price marketCap created_at -_id");
    let csv = "";

    // Encabezados
    const headers = Object.keys(cryptos[0].toObject());
    csv = csv + headers.join(";") + "; \n";

    // Recorremos cada fila
    cryptos.forEach((item) => {
      // Dentro de cada fila recorremos todas las propiedades
      headers.forEach((header) => {
        csv = csv + item[header] + ";";
      });
      csv = csv + "\n";
    });
    res.send(csv);
  } catch (error) {
    res.status(500).json(error);
  }
});

// No CRUD. Busqueda personalizada
router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const crypto = await Crypto.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (crypto) {
      res.json(crypto);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD: Reset de la BBDD de cryptos
router.delete("/reset", async (req, res) => {
  try {
    await deleteAndInsertCryptos();
    const cryptos = await Crypto.find();
    res.json(cryptos);
  } catch (error) {
    res.status(500).json();
  }
});

// CRUD: Read
// Ejemplo de request con parametros http://localhost:3000/crypto/?page=2&limit=10
router.get("/", async (req, res) => {
  try {
    // Lectura de query parameters
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cryptos = await Crypto.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Conteo del total de elementos
    const totalElements = await Crypto.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: cryptos,
    };

    res.json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CRUD: Create ?
router.post("/", async (req, res) => {
  try {
    const crypto = new Crypto(req.body);

    const createdCrypto = await crypto.save();
    return res.status(200).json(createdCrypto);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD: Read
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const crypto = await Crypto.findByIdAndUpdate(id);
    if (crypto) {
      res.json(crypto);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD: Delete
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cryptoDeleted = await Crypto.findByIdAndDelete(id);
    if (cryptoDeleted) {
      res.json(cryptoDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json();
  }
});

// CRUD: Put
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const criptoUpdated = await Crypto.findByIdAndUpdate(id, req.body);
    if (criptoUpdated) {
      res.json(criptoUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = { userRoutes: router };
