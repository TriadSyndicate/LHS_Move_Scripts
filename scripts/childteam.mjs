import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import loadEnv from '../loadEnv.js'
// Import Schemas

import { formatMatchDate } from '../helper/datehelper.js'
import { ExportFixtureSchema } from '../models/fixture.model.js'

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
const SourceFixture = sourceDB.model(
  'Fixture',
  new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'Competition' },
    competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
    comp_year: String,
    rounds: [
      {
        matchups: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
      },
    ],
  })
)

// Define the new Team model in the destination database
const NewFixture = destinationDB.model('Fixture', ExportFixtureSchema)

// Enable Mongoose debugging
mongoose.set('debug', true)

// Function to migrate data from source to destination
const migrateData = async () => {
  try {
    console.log('Starting data migration...')

    console.log('Fetching fixtures from source database...')
    const oldFixtures = await SourceFixture.find().exec()
    console.log(`Fetched ${oldFixtures.length} fixtures from source database.`)

    // Transform and insert data into new collections
    const newFixtures = oldFixtures.map((fixture) => ({
      _id: fixture._id,
      competition_id: fixture.competition,
      competition_year: fixture.comp_year,
      stages: fixture.rounds.map((round, index) => ({
        name: `Round ${index + 1}`,
        matchups: round.matchups,
      })),
    }))

    console.log('Inserting fixtures into destination database...')
    await NewFixture.insertMany(newFixtures)
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
