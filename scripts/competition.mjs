import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import loadEnv from '../loadEnv.js'
// Import Schemas
import { ExportCompetitionSchema } from '../models/competition.model.js'

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
const SourceCompetition = sourceDB.model(
  'Competition',
  new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'Competition' },
    name: String,
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    body_id: { type: Schema.Types.ObjectId, ref: 'Body' }, // Reference to the Body model
  })
)

// Define the new Team model in the destination database
const NewCompetition = destinationDB.model('Competition', ExportCompetitionSchema)

// Enable Mongoose debugging
mongoose.set('debug', true)

// Function to migrate data from source to destination
const migrateData = async () => {
  try {
    console.log('Starting data migration...')

    console.log('Fetching competitions from source database...')
    const oldCompetitions = await SourceCompetition.find().exec()
    console.log(`Fetched ${oldCompetitions.length} competitions from source database.`)

    // Transform and insert data into new collections
    const newCompetitions = oldCompetitions.map((competition) => ({
      _id: competition._id,
      name: competition.name,
    }))

    console.log('Inserting competitions into destination database...')
    await NewCompetition.insertMany(newCompetitions)
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
