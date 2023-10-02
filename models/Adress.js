const { default: mongoose, models, model } = require("mongoose");
const { Schema } = require("mongoose");

const AdressSchema = new Schema({
    userEmail: {type: String, unique:true, required: true},
    name: String,
    email: String,
    city: String,
    country: String,
    postalCode: String,
    streetAddress: String,
});

export const Adress = models?.Address || model('Address',AdressSchema);