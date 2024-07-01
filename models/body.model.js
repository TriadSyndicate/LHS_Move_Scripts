import { model, Schema } from 'npm:mongoose'

// Define the Body schema
const bodySchema = new Schema({
  name: String,
  competitions: [{ type: Schema.Types.ObjectId, ref: 'Competition' }],
})

// Define methods for the Body schema
bodySchema.methods = {
  // Create a new body
  async createBody(name, competitions = []) {
    try {
      const newBody = new this({ name, competitions })
      return await newBody.save()
    } catch (error) {
      throw new Error(`Error creating body: ${error.message}`)
    }
  },

  // Update body name and save
  async updateBodyName(newName) {
    try {
      this.name = newName
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating body name: ${error.message}`)
    }
  },

  // Update competition ObjectId in array
  async addCompetition(competitionId) {
    try {
      this.competitions.push(competitionId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error adding competition: ${error.message}`)
    }
  },

  // Remove a competition from array and save
  async removeCompetition(competitionId) {
    try {
      this.competitions.pull(competitionId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing competition: ${error.message}`)
    }
  },

  // Delete a body
  async deleteBody() {
    try {
      return await this.remove()
    } catch (error) {
      throw new Error(`Error deleting body: ${error.message}`)
    }
  },
}

// Export the Body model
export default model('Body', bodySchema)
