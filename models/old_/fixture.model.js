const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Fixture schema
const fixtureSchema = new Schema({
  competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
  comp_year: String,
  rounds: [
    {
      matchups: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
    }
  ],
});

// Create the Fixture model
const Fixture = mongoose.model('Fixture', fixtureSchema);

module.exports = Fixture;
