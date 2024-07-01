const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Matches schema
const matchSchema = new Schema({
  competition_id: { type: Schema.Types.ObjectId, ref: "Competition" },
  home_team: { type: Schema.Types.ObjectId, ref: "Team" },
  away_team: { type: Schema.Types.ObjectId, ref: "Team" },
  date: String,
  venue: String,
  match_url: String,
  home_stats: [
    {
      match_id: { type: Schema.Types.ObjectId, ref: "Match" },
      player_id: { type: Schema.Types.ObjectId, ref: "Player" },
      starter: Boolean,
      min_played: Number,
      goals: [
        {
          match_id: { type: Schema.Types.ObjectId, ref: "Match" },
          minute: Number,
        },
      ],
      assists: Number,
      yellow_cards: Number,
      red_cards: Number,
      own_goals: Number,
    },
  ],
  away_stats: [
    {
      match_id: { type: Schema.Types.ObjectId, ref: "Match" },
      player_id: { type: Schema.Types.ObjectId, ref: "Player" },
      starter: Boolean,
      min_played: Number,
      goals: [
        {
          match_id: { type: Schema.Types.ObjectId, ref: "Match" },
          minute: Number,
        },
      ],
      assists: Number,
      yellow_cards: Number,
      red_cards: Number,
      own_goals: Number,
    },
  ],
  data_entered: Boolean,
  match_events: Array,
  video: Array,
});

// Create the Match model
const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
