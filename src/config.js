const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://codingnerd95:mcqueen95@log.rgnuth1.mongodb.net/test")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed to connect");
  });

const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    required: true,
  },
});

const collection = new mongoose.model("collection_page", LogInSchema);

module.exports = collection;
