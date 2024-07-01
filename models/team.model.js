import { model, Schema } from 'mongoose'

// Define Parent Team schema
const parentTeamSchema = new Schema({
  name: String,
  on_contract_players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  child_teams: [{ type: Schema.Types.ObjectId, ref: 'ChildTeam' }],
  linked_country: { type: Schema.Types.ObjectId, ref: 'Country' },
})

parentTeamSchema.methods = {
  // update parent team name
  updateTeamName: async function (teamName) {
    try {
      this.name = teamName
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating team name: ${error.message}`)
    }
  },
  // update on_contract_players
  addPlayerToContract: async function (playerId) {
    try {
      this.on_contract_players.push(playerId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error adding player to on contract player: ${error.message}`)
    }
  },
  removePlayerFromContract: async function (playerId) {
    try {
      this.on_contract_players.pull(playerId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing player from contract players: ${error.message}`)
    }
  },
  // update category
  updateCategory: async function (category) {
    try {
      this.category = category
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`)
    }
  },
  // update child_teams
  addTeamToChildTeam: async function (teamId) {
    try {
      this.child_teams.push(teamId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error adding child teams: ${error.message}`)
    }
  },
  removeTeamFromChildTeam: async function (teamId) {
    try {
      this.child_teams.pull(teamId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing child team: ${error.message}`)
    }
  },
  // update linked_country
  updateLinkedCountry: async function (countryId) {
    try {
      this.linked_country = countryId
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating linked country: ${error.message}`)
    }
  },
  // delete parent team, delete child teams first
  deleteParentTeam: async function () {
    try {
    } catch (error) {}
  },
}
// Define the Child Team schema
const childTeamSchema = new Schema({
  name: String,
  type: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
  roster: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  past_players: [
    {
      player_id: { type: Schema.Types.ObjectId, ref: 'Player' },
      start_date: Date,
      end_date: Date,
    },
  ],
  competitions: [{ type: Schema.Types.ObjectId, ref: 'Competition' }],
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
})

// Schema methods =>
childTeamSchema.methods = {
  createChildTeam: async function (name) {
    try {
      const childTeam = new this({ name })
      return await childTeam.save()
    } catch (error) {
      throw new Error(`Error creating child team: ${error.message}`)
    }
  },
  // update child_team roster
  updateRosterWithPlayer: async function (playerId) {
    try {
      this.roster.push(playerId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating roster with player: ${error.message}`)
    }
  },
  // remove playerId from roster
  removePlayerFromRoster: async function (playerId) {
    try {
      // find playerId in roster and remove
      this.roster.pull(playerId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing player from roster: ${error.message}`)
    }
  },
  // update subcategory-type
  updateSubcategoryType: async function (subcategoryId) {
    try {
      this.type = subcategoryId
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating subcategory type: ${error.message}`)
    }
  },
  // update past players doc
  updatePastPlayers: async function (old_player_id, start_date, end_date) {
    try {
      this.past_players.push({ player_id: old_player_id, start_date, end_date })
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating past players: ${error.message}`)
    }
  },
  // update team name
  updateTeamName: async function (new_team_name) {
    try {
      this.name = new_team_name
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating team name: ${error.message}`)
    }
  },
  // update matches array
  updateTeamMatches: async function (new_match_id) {
    try {
      this.matches.push(new_match_id)
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating team matches: ${error.message}`)
    }
  },

  //update comps array
  updateTeamCompetitions: async function (competition_id) {
    try {
      this.comps.push(competition_id)
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating team competitions: ${error.message}`)
    }
  },
}

// Create ParentTeam model
export const ParentTeam = model('ParentTeam', parentTeamSchema)
// Create ChildTeam model
export const ChildTeam = model('ChildTeam', childTeamSchema)
