const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the Competition schema
const competitionSchema = new Schema({
    name: String,
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    body_id: { type: Schema.Types.ObjectId, ref: 'Body' }, // Reference to the Body model
  });
  
  // Create the Competition model
  const Competition = mongoose.model('Competition', competitionSchema);
  
  module.exports = Competition;