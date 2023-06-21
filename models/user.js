const mongoose = require ('mongoose')

const UserSchema = new mongoose.Schema({

    username: {
        type: String
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    profileImg: {
        type: String,
        default: ""
    }
},  
{
    //opzione timestamps: quando utente salva i dati immessi si aggiornano le date di creazione ed aggiornamento ed opzione strict: accetta solo i dati che abbiamo richiesto
    timestamps: true,
    strict: true,

  })

  module.exports = mongoose.model ("User", UserSchema)