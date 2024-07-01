const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define the Players schema
const playerSchema = new Schema({
  name: String,
  dob: String,
  nationality: String,
  jersey_num: Number,
  performance: Object,
  stats: {
    match_day_squad: Number,
    starter: Number,
    min_played: Number,
    starter_minutes: Number,
    sub_minutes: Number,
    goals: [
      {
        minute: Number,
        match_id: { type: Schema.Types.ObjectId, ref: 'Match' },
      },
    ],
    assists: Number,
    yellow_cards: Number,
    red_cards: Number,
    clean_sheets: Number,
    own_goals: Number,
  },
  national_stats: {
    match_day_squad: Number,
    starter: Number,
    min_played: Number,
    starter_minutes: Number,
    sub_minutes: Number,
    goals: [
      {
        minute: Number,
        match_id: { type: Schema.Types.ObjectId, ref: 'National_Match' },
      },
    ],
    assists: Number,
    yellow_cards: Number,
    red_cards: Number,
    clean_sheets: Number,
    own_goals: Number,
  },
  teams: [
    {
      team_id: { type: Schema.Types.ObjectId, ref: 'Team' },
      reg_date: String,
      on_team: Boolean,
    },
  ],
  national_teams: [
    {
      team_id: { type: Schema.Types.ObjectId, ref: 'National_Team' },
      reg_date: String,
      on_team: Boolean,
      call_up: Boolean,
    },
  ],
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  national_matches: [{ type: Schema.Types.ObjectId, ref: 'National_Match' }],
  supporting_file: String,
  gender: String,
  position: String,
  video: Array,
})

// Create the Player model
export const Player = mongoose.model('Player', playerSchema)

export const ExportPlayerSchema = playerSchema
//module.exports = Player
