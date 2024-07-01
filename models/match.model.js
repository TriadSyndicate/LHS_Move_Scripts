import { model, Schema } from 'mongoose'

// Define the Matches schema
const matchSchema = new Schema({
  fixture_id: { type: Schema.Types.ObjectId, ref: 'Fixture' },
  stage_id: { type: Schema.Types.ObjectId, ref: 'Stage' }, // Embedded document
  competition_id: { type: Schema.Types.ObjectId, ref: 'Competition' },
  home_team: { type: Schema.Types.ObjectId, ref: 'ChildTeam' },
  away_team: { type: Schema.Types.ObjectId, ref: 'ChildTeam' },
  date: Date,
  venue: String,
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
  formation: { home_team: String, away_team: String },
  match_events: [
    {
      event_type: String,
      event_type_data_object: Object,
      player_id: { type: Schema.Types.ObjectId, ref: 'Player' },
      match_id: { type: Schema.Types.ObjectId, ref: 'Match' },
      minute: Number,
    },
  ],
  videos: Array,
  documents: Array, // links as URL string arrays
})

// Define methods for the Match schema
matchSchema.methods = {
  // Create a new match
  async createMatch(competitionId, homeTeam, awayTeam, date, venue) {
    try {
      const newMatch = new this({
        competition_id: competitionId,
        home_team: homeTeam,
        away_team: awayTeam,
        date: date,
        venue: venue,
      })
      return await newMatch.save()
    } catch (error) {
      throw new Error(`Error creating match: ${error.message}`)
    }
  },

  // update fixtureId and stageId after fixture is created
  async updateFixtureDetails(fixture_id, stage_id) {
    try {
      this.fixture_id = fixture_id
      this.stage_id = stage_id
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating fixture details: ${error.message}`)
    }
  },

  // Update date of match
  async updateMatchDate(newDate) {
    try {
      this.date = newDate
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating match date: ${error.message}`)
    }
  },

  // Update venue of match
  async updateMatchVenue(newVenue) {
    try {
      this.venue = newVenue
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating match venue: ${error.message}`)
    }
  },

  // Update home_stats events
  async updateHomeStats(stats) {
    try {
      this.home_stats = stats
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating home stats: ${error.message}`)
    }
  },

  // Update away_stats events
  async updateAwayStats(stats) {
    try {
      this.away_stats = stats
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating away stats: ${error.message}`)
    }
  },

  // Update data_entered boolean
  async updateDataEnteredStatus(status) {
    try {
      this.data_entered = status
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating data entered status: ${error.message}`)
    }
  },

  // Update formation object
  async updateFormation(formation) {
    try {
      this.formation = formation
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating formation: ${error.message}`)
    }
  },

  // Add video string to videos array
  async addVideo(videoUrl) {
    try {
      this.videos.push(videoUrl)
      return await this.save()
    } catch (error) {
      throw new Error(`Error adding video: ${error.message}`)
    }
  },

  // Remove video string from videos array
  async removeVideo(videoUrl) {
    try {
      this.videos.pull(videoUrl)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing video: ${error.message}`)
    }
  },

  // Add document string to documents array
  async addDocument(documentUrl) {
    try {
      this.documents.push(documentUrl)
      return await this.save()
    } catch (error) {
      throw new Error(`Error adding document: ${error.message}`)
    }
  },

  // Remove document string from documents array
  async removeDocument(documentUrl) {
    try {
      this.documents.pull(documentUrl)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing document: ${error.message}`)
    }
  },

  // Delete match
  async deleteMatch() {
    try {
      return await this.remove()
    } catch (error) {
      throw new Error(`Error deleting match: ${error.message}`)
    }
  },
}

export const Match = model('Match', matchSchema)

export const ExportMatchSchema = matchSchema
