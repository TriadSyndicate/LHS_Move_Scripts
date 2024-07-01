const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Body schema
const bodySchema = new Schema({
  name: String,
  competitions: [{ type: Schema.Types.ObjectId, ref: "Competition" }],
  national_competitions: [
    { type: Schema.Types.ObjectId, ref: "National_Competition" },
  ],
});

// Create the Body model
const Body = mongoose.model("Body", bodySchema);

module.exports = Body;
