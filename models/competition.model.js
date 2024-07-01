import { model, Schema } from 'mongoose'

// Define the Competition schema
const competitionSchema = new Schema({
  name: String,
  teams: [{ type: Schema.Types.ObjectId, ref: 'ChildTeam' }],
  body_id: { type: Schema.Types.ObjectId, ref: 'Body' },
  category_ids: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
})

// Define methods for the Competition schema
competitionSchema.methods = {
  // Create a new competition
  async createCompetition(name, bodyId, categoryIds = [], teams = []) {
    try {
      const newCompetition = new this({ name, body_id: bodyId, category_ids: categoryIds, teams })
      return await newCompetition.save()
    } catch (error) {
      throw new Error(`Error creating competition: ${error.message}`)
    }
  },

  // Update competition name
  async updateCompetitionName(newName) {
    try {
      this.name = newName
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating competition name: ${error.message}`)
    }
  },

  // Update bodyId linking to competition
  async updateBodyId(newBodyId) {
    try {
      this.body_id = newBodyId
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating bodyId: ${error.message}`)
    }
  },

  // Add team to competition
  async addTeam(teamId) {
    try {
      this.teams.push(teamId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error adding team to competition: ${error.message}`)
    }
  },

  // Remove team from competition
  async removeTeam(teamId) {
    try {
      this.teams.pull(teamId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing team from competition: ${error.message}`)
    }
  },

  // Add categoryId to categories
  async addCategory(categoryId) {
    try {
      this.category_ids.push(categoryId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error adding category to competition: ${error.message}`)
    }
  },

  // Remove categoryId from categories
  async removeCategory(categoryId) {
    try {
      this.category_ids.pull(categoryId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing category from competition: ${error.message}`)
    }
  },

  // Delete competition
  async deleteCompetition() {
    try {
      return await this.remove()
    } catch (error) {
      throw new Error(`Error deleting competition: ${error.message}`)
    }
  },
}

// Export the Competition model
export const Competition = model('Competition', competitionSchema)

export const ExportCompetitionSchema = competitionSchema
