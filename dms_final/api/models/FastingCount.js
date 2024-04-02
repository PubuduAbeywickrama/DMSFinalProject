const mongoose = require("mongoose");

const FastingCountSchema = new mongoose.Schema(
  {
    userid: {
        type: String
    },
    sugarcount: {
      type: String
    },
    date: {
      type: String
    }
  },

);
module.exports = mongoose.model("FastingCount", FastingCountSchema);
