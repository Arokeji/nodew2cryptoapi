const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creacion del esquema del libro
const cryptoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    marketCap: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
    }
  },
  {
    // Deja fecha y hora
    timestamps: true,
  }
);

// Creacion del modelo en si con un nombre y la configuracion del esquema
const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = { Crypto };
