import { model, Schema } from 'mongoose'
// Define the Players schema
import { convertDateObjToDDMMYYYY } from '../helper/datehelper.js'
// Player performance object for player and ghostPlayer models
const playerPerformance = {
  team_matches: Number,
  appearances: Number,
  matches_started: Number,
  mins: Number,
  mins_90: Number,
  percent_matches: Number,
  percent_potential_mins: Number,
  goals: Number,
  goals_per_90: Number,
  mins_per_goal: Number,
  penalties: Number,
  assists: Number,
  assists_per_90: Number,
  goal_contributions: Number,
  goal_contributions_per_90: Number,
  conceded: Number,
  conceded_per_90: Number,
  clean_sheets: Number,
}
// Player Stats Object for player and ghost player models
const playerStats = {
  match_day_squad: Number,
  starter: Number,
  min_played: Number,
  starter_minutes: Number,
  sub_minutes: Number,
  goals: Number,
  assists: Number,
  yellow_cards: Number,
  red_cards: Number,
  own_goals: Number,
  clean_sheets: Number,
}
// Player Team Object for player & ghost player models
const playerTeamObjectArray = [
  {
    team_id: { type: Schema.Types.ObjectId, ref: 'ParentTeam' },
    reg_date: Date,
    end_date: Date,
    contractType: String,
    on_team: Boolean,
  },
]

const ghostPlayerSchema = new Schema({
  main_player_id: { type: Schema.Types.ObjectId, ref: 'Player' },
  fake_dob: Date,
  child_teams: playerTeamObjectArray,
  performance: playerPerformance,
  jersey_num: Number,
  stats: playerStats,
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  foot: String,
  positions: Array, // Array of different positions
  gender: String,
})

const mainPlayerSchema = new Schema({
  name: String,
  real_dob: Date,
  nationality: [{ type: Schema.Types.ObjectId, ref: 'Country' }], // Array of Country ObjectIds
  performance: playerPerformance,
  stats: playerStats,
  parent_teams: playerTeamObjectArray,
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  foot: String,
  positions: Array, // Array of different positions
  gender: String,
  ghost_players: [ghostPlayerSchema], // array to ghost player objects
  injuries: [
    {
      date_of_injury: Date,
      type_of_injury: String,
      status: String, // Back in training, Recovering, Recovered, Unknown
      recovery_date: Date,
    },
  ],
  supporting_file: String,
  video: Array,
})

mainPlayerSchema.methods = {
  // Create a Player
  async createPlayer(name) {
    try {
      const newPlayer = new MainPlayer({
        name,
        real_dob,
        nationality,
        performance,
        stats,
        parent_teams,
        matches,
        foot,
        positions,
        gender,
        ghost_player_ids,
        injuries,
        supporting_file,
        video,
      })
      return await newPlayer.save()
    } catch (error) {
      throw new Error(`Error creating player: ${error.message}`)
    }
  },
  // Get Player
  async getPlayer() {
    try {
      let myPlayerObj = JSON.stringify(this)
      myPlayerObj = JSON.parse(myPlayerObj)
      myPlayerObj.real_dob = convertDateObjToDDMMYYYY(this.real_dob)
      return myPlayerObj
    } catch (error) {
      throw new Error(`Error retrieving player ${error.message}`)
    }
  },
  // Update real date of birth
  async updateRealDOB(newDOB) {
    try {
      this.real_dob = newDOB
      await this.save()
      return this // Return the updated document instance
    } catch (error) {
      throw new Error(`Error updating real date of birth: ${error.message}`)
    }
  },
  // Update nationality array with new countryId
  async updateNationality(newNationalityCountryId) {
    this.nationality.push(newNationalityCountryId)
    return this.save()
  },
  // Remove Nationality CountryId
  async removeNationality(nationalityToRemove) {
    this.nationality = this.nationality.filter((nat) => nat !== nationalityToRemove)
    return this.save()
  },
  // Update player performance object with key attribute
  async updatePerformance(key, newValue) {
    this.performance[key] = newValue
    return this.save()
  },
  // Update player stats object with key
  async updateStats(key, newValue) {
    this.stats[key] = newValue
    return this.save()
  },
  // Update parent_teams player team object array
  async addTeamToParentTeams(parentTeamObject) {
    this.parent_teams.push(parentTeamObject)
    return this.save()
  },
  // Update matches array
  async updateMatches(newMatch) {
    this.matches.push(newMatch)
    return this.save()
  },
  // Update main foot String
  async updateFoot(newFoot) {
    this.foot = newFoot
    return this.save()
  },
  // Add position to positions array
  async addPosition(newPosition) {
    this.positions.push(newPosition)
    return this.save()
  },
  // Remove position from positions array
  async removePosition(positionToRemove) {
    this.positions = this.positions.filter((pos) => pos !== positionToRemove)
    return this.save()
  },
  // Update gender string
  async updateGender(newGender) {
    this.gender = newGender
    return this.save()
  },
  // Add ghost player id to ghost player Ids
  async addGhostPlayerId(ghostPlayerId) {
    this.ghost_player_ids.push(ghostPlayerId)
    return this.save()
  },
  // Remove ghost playerId from ghost playerIds array
  async removeGhostPlayerId(ghostPlayerIdToRemove) {
    this.ghost_player_ids = this.ghost_player_ids.filter((id) => id.toString() !== ghostPlayerIdToRemove.toString())
    return this.save()
  },
  // Add injury object to injuries array
  async addInjury(newInjury) {
    this.injuries.push(newInjury)
    return this.save()
  },
  // Update supporting_file
  async updateSupportingFile(newSupportingFile) {
    this.supporting_file = newSupportingFile
    return this.save()
  },
  // Update video array with video string
  async updateVideo(newVideo) {
    this.video.push(newVideo)
    return this.save()
  },
  // Update team_reg for parent team - [contract type, end_team, on_team]
}

// Create the Main Player model
export const MainPlayer = model('Player', mainPlayerSchema)
// Create ghost player model and export
export const GhostPlayer = model('GhostPlayer', ghostPlayerSchema)

// export schemas

export const ExportMainPlayerSchema = mainPlayerSchema

export const ExportGhostPlayerSchema = ghostPlayerSchema
