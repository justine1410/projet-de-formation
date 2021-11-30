const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//s'assure que personne ne peut partager la même adresse e-mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
