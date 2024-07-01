import { model, Schema } from 'mongoose'

// Define the Teams schema
const teamSchema = new Schema({
  name: String,
  roster: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  comps: [{ type: Schema.Types.ObjectId, ref: 'Competition' }],
  past_players:[{
    player_id: { type: Schema.Types.ObjectId, ref: 'Player' },
    start_date: String,
    end_date: String,
  }]
});

// Create the Team model
const Team = model('Team', teamSchema);

export default Team
