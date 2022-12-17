const mongoose = require("../database/connection");

const lockHistorySchema = new mongoose.Schema({
    lockName: {
      type: String,
      required: true,
    },
    start_time: {
      type: Date,
      required: true
    },
    end_time: {
      type: Date,
      required: true
    },
  });

  module.exports = lockHistorySchema;