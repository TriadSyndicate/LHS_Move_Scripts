import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import loadEnv from '../loadEnv.js'
// Import Schemas
import { ExportMainPlayerSchema, ExportGhostPlayerSchema } from '../models/player.model.js'
import { validateDateInCorrectFormat } from '../helper/datehelper.js'

const env = await loadEnv()
mongoose.set('debug', true)

// Connection options
const options = {
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
}

// Connect to the source MongoDB (old)
const sourceDB = mongoose.createConnection(env.OLD_URI, options)

// Add event listeners for better logging
sourceDB.on('connected', () => console.log('SourceDB connected successfully'))
sourceDB.on('error', (err) => console.error('SourceDB connection error:', err))

// Connect to the destination MongoDB (new)
const destinationDB = mongoose.createConnection(env.ATLAS_URI, options)

// Add event listeners for better logging
destinationDB.on('connected', () => console.log('DestinationDB connected successfully'))
destinationDB.on('error', (err) => console.error('DestinationDB connection error:', err))
// player docs
// team docs add child team and link, child team matches, competitions
const SourcePlayer = sourceDB.model(
  'Player',
  new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'Player' },
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
)

// Define the new Team model in the destination database
const NewPlayer = destinationDB.model('Player', ExportMainPlayerSchema)

// Enable Mongoose debugging
mongoose.set('debug', true)

// Function to migrate data from source to destination
const migrateData = async () => {
  try {
    console.log('Starting data migration...')

    console.log('Fetching players from source database...')
    const oldPlayers = await SourcePlayer.find().exec()
    console.log(`Fetched ${oldPlayers.length} players from source database.`)

    // Transform and insert data into new collections
    const newPlayers = oldPlayers.map((player) => ({
      _id: player._id,
      name: player.name,
      real_dob: validateDateInCorrectFormat(player.dob).status ? validateDateInCorrectFormat(player.dob).date : null,
    }))

    console.log('Inserting players into destination database...')
    await NewPlayer.insertMany(newPlayers)
    console.log('Data migration completed successfully.')
  } catch (error) {
    console.error('Error during data migration:', error)
  } finally {
    // Close the connections
    sourceDB.close()
    destinationDB.close()
  }
}

// Start the migration
migrateData()
