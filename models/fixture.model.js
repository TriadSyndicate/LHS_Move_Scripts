import { model, Schema } from 'mongoose'

// Define the Stage Structure
const stageSchema = new Schema({
  name: String,
  matchups: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
})

// Define the Fixture schema
const fixtureSchema = new Schema({
  competition_id: { type: Schema.Types.ObjectId, ref: 'Competition' },
  competition_year: { type: String, required: false },
  fixture_type: { type: String, required: false },
  stages: [stageSchema], // Use the defined stage schema
})

// Define methods for the Fixture schema
fixtureSchema.methods = {
  // Create a new fixture
  async createFixture(competitionId, competitionYear, fixtureType, stages = []) {
    try {
      const newFixture = new this({ competition_id: competitionId, competition_year: competitionYear, fixture_type: fixtureType, stages })
      return await newFixture.save()
    } catch (error) {
      throw new Error(`Error creating fixture: ${error.message}`)
    }
  },

  // Update competition_id
  async updateCompetitionId(newCompetitionId) {
    try {
      this.competition_id = newCompetitionId
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating competition_id: ${error.message}`)
    }
  },

  // Update competition year
  async updateCompetitionYear(newCompetitionYear) {
    try {
      this.competition_year = newCompetitionYear
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating competition_year: ${error.message}`)
    }
  },

  // Update Fixture Type
  async updateFixtureType(newFixtureType) {
    try {
      this.fixture_type = newFixtureType
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating fixture_type: ${error.message}`)
    }
  },

  // Add a new stage to stages array
  async addStage(stage) {
    try {
      this.stages.push(stage)
      return await this.save()
    } catch (error) {
      throw new Error(`Error adding stage: ${error.message}`)
    }
  },

  // Remove a stage from stages array
  async removeStage(stageId) {
    try {
      this.stages.pull(stageId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing stage: ${error.message}`)
    }
  },

  // Update specific stage name and update stages array
  async updateStageName(stageId, newName) {
    try {
      const stage = this.stages.id(stageId)
      if (!stage) {
        throw new Error('Stage not found')
      }
      stage.name = newName
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating stage name: ${error.message}`)
    }
  },

  // Delete fixture
  async deleteFixture() {
    try {
      return await this.remove()
    } catch (error) {
      throw new Error(`Error deleting fixture: ${error.message}`)
    }
  },
}

// Create the Fixture model
export const Fixture = model('Fixture', fixtureSchema)

export const ExportFixtureSchema = fixtureSchema
