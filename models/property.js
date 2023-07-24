const mongoose = require ('mongoose')

const PropertySchema = new mongoose.Schema({

    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true,
        min: 6
    },

    type: {
        type: String,
        enum: ["appartment", "single home", "luxury villa"],
        required: true
    },

    description: {
        type: String,
        required: true,
        min: 15
    },

    price: {
        type: Number,
        required: true
    },

    squaremeters: {
        type: Number,
        required: true
    },

    img: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    bedrooms: {
        type: Number,
        required: true,
        min: 2
    },

    latest: {
        type: Boolean,
        default: true
    }
},
{
    //opzione timestamps: quando utente salva i dati immessi si aggiornano le date di creazione ed aggiornamento ed opzione strict: accetta solo i dati che abbiamo richiesto
    timestamps: true,
    strict: true,

  })

  module.exports = mongoose.model ("Property", PropertySchema)