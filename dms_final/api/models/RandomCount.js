const mongoose = require("mongoose");

const RandomCountSchema = new mongoose.Schema(
  {
    userid: {
        type: String
    },
    sugarcount: {
      type: String
    },
    date: {
      type: String
    },
    time: {
      type: String
    },
  },

);
module.exports = mongoose.model("RandomCount", RandomCountSchema);
