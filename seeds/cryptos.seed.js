const { deleteAndInsertCryptos } = require("./cryptos.seed.aux");
const mongoose = require("mongoose");
const { connect } = require("../db.js");

const cryptoConnect = async () => {
  try {
    console.log("Comenzando conexion desde el seed");
    await connect();
    console.log("Conexion desde el seed satisfactoria");
    await deleteAndInsertCryptos();
  } catch (error) {
    console.log("Fallo al conectar al conectar a la BBDD: " + error);
  } finally {
    await mongoose.disconnect();
  }
};

cryptoConnect();
