import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import loadEnv from './loadEnv.js'
import Team from './models/old_/team.model.js' // Ensure this path is correct
import { ParentTeam } from './models/team.model.js' // Ensure this path is correct

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
const TestTeam = sourceDB.model(
  'Team',
  new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'Team' },
    name: String,
    roster: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
    comps: [{ type: Schema.Types.ObjectId, ref: 'Competition' }],
    past_players: [
      {
        player_id: { type: Schema.Types.ObjectId, ref: 'Player' },
        start_date: String,
        end_date: String,
      },
    ],
  })
)

// Define the new Team model in the destination database
const NewTeam = destinationDB.model(
  'ParentTeam',
  new mongoose.Schema({
    name: String,
    on_contract_players: [{ type: Schema.Types.ObjectId, ref: 'MainPlayer' }],
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    child_teams: [{ type: Schema.Types.ObjectId, ref: 'ChildTeam' }],
    linked_country: { type: Schema.Types.ObjectId, ref: 'Country' },
  })
)

// Enable Mongoose debugging
mongoose.set('debug', true)

// Function to migrate data from source to destination
const migrateData = async () => {
  try {
    console.log('Starting data migration...')

    console.log('Fetching teams from source database...')
    const oldTeams = await TestTeam.find().exec()
    console.log(`Fetched ${oldTeams.length} teams from source database.`)

    // Transform and insert data into new collections
    const newTeams = oldTeams.map((team) => ({
      _id: team._id,
      name: team.name,
    }))

    console.log('Inserting teams into destination database...')
    await NewTeam.insertMany(newTeams)
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
