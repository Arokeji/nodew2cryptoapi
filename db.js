console.log("::: Conectando a la BBDD :::");
require("dotenv").config();

const DB_CONNECTION = process.env.DB_CONNECTION;

const mongoose = require("mongoose");

// Configuracion de la conexion
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: "node-w2"
};

const connect = async () => {
  const database = await mongoose.connect(DB_CONNECTION, config);
  const name = database.connection.name;
  const host = database.connection.host;
  console.log(`Conectado a ${name} en ${host}`);
};

module.exports = { connect };
