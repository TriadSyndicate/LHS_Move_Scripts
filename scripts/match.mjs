import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import loadEnv from '../loadEnv.js'
// Import Schemas
import { ExportMainPlayerSchema, ExportGhostPlayerSchema } from '../models/player.model.js'
import { ExportMatchSchema } from '../models/match.model.js'

import { formatMatchDate } from '../helper/datehelper.js'

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
const SourceMatch = sourceDB.model(
  'Match',
  new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'Match' },
    competition_id: { type: Schema.Types.ObjectId, ref: 'Competition' },
    home_team: { type: Schema.Types.ObjectId, ref: 'Team' },
    away_team: { type: Schema.Types.ObjectId, ref: 'Team' },
    date: String,
    venue: String,
    match_url: String,
    home_stats: [
      {
        match_id: { type: Schema.Types.ObjectId, ref: 'Match' },
        player_id: { type: Schema.Types.ObjectId, ref: 'Player' },
        starter: Boolean,
        min_played: Number,
        goals: [
          {
            match_id: { type: Schema.Types.ObjectId, ref: 'Match' },
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
        match_id: { type: Schema.Types.ObjectId, ref: 'Match' },
        player_id: { type: Schema.Types.ObjectId, ref: 'Player' },
        starter: Boolean,
        min_played: Number,
        goals: [
          {
            match_id: { type: Schema.Types.ObjectId, ref: 'Match' },
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
  })
)

// Define the new Team model in the destination database
const NewMatch = destinationDB.model('Match', ExportMatchSchema)

// Enable Mongoose debugging
mongoose.set('debug', true)

// Function to migrate data from source to destination
const migrateData = async () => {
  try {
    console.log('Starting data migration...')

    console.log('Fetching matches from source database...')
    const oldMatches = await SourceMatch.find().exec()
    console.log(`Fetched ${oldMatches.length} matches from source database.`)

    // Transform and insert data into new collections
    const newMatches = oldMatches.map((match) => ({
      _id: match._id,
      venue: match.venue,
      date: formatMatchDate(match.date).status ? formatMatchDate(match.date).date : null,
      home_stats: match.home_stats,
      away_stats: match.away_stats,
      data_entered: match.data_entered,
    }))

    console.log('Inserting matches into destination database...')
    await NewMatch.insertMany(newMatches)
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
