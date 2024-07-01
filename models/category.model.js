import { model, Schema } from 'npm:mongoose'

// Define Category Schema
const categorySchema = new Schema({
  name: String, // Club, National, School, Academy etc.
})

// methods
categorySchema.methods = {
  // create new category
  async createCategory(name) {
    try {
      const newCategory = new this({ name })
      return await newCategory.save()
    } catch (error) {
      throw new Error(`Error creating Category: ${error.message}`)
    }
  },
  // Update category name
  async updateCategory(newName) {
    try {
      this.name = newName
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating Category Name: ${error.message}`)
    }
  },

  // deleting category
  async deleteCategory() {
    try {
      return await this.remove()
    } catch (error) {
      throw new Error(`Error deleting Category: ${error.message}`)
    }
  },
}

// Define SubCategory Schema
const subCategorySchema = new Schema({
  name: String, // u17, u21, u19,
})

subCategorySchema.methods = {
  // create new subcategory
  async createSubCategory(name) {
    try {
      const newSubCategory = new this({ name })
      return await newSubCategory.save()
    } catch (error) {
      throw new Error(`Error creating SubCategory: ${error.message}`)
    }
  },
  // Update subcategory name
  async updateSubCategory(newName) {
    try {
      this.name = newName
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating SubCategory Name: ${error.message}`)
    }
  },

  // deleting category
  async deleteSubCategory() {
    try {
      return await this.remove()
    } catch (error) {
      throw new Error(`Error deleting Sub Category: ${error.message}`)
    }
  },
}

// Define Country Schema
const countrySchema = new Schema({
  name: String, // Country name schema
  countryCode: String, // respective country code
})

countrySchema.methods = {
  // create country
  async createCountry(name, countryCode) {
    try {
      const newCountry = new this({ name, countryCode })
      return await newCountry.save()
    } catch (error) {
      throw new Error(`Error creating new country: ${error.message}`)
    }
  },
  // update country Code
  async updateCountryCode(countryCode) {
    try {
      this.countryCode = countryCode
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating country code: ${error.message}`)
    }
  },
  // update country name
  async updateCountryName(newName) {
    try {
      this.name = newName
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating country name: ${error.message}`)
    }
  },
  // delete country
  async deleteCountry() {
    try {
      return await this.remove()
    } catch (error) {
      throw new Error(`Error deleting country: ${error.message}`)
    }
  },
}

// Define territories
const territorySchema = new Schema({
  name: String, // Name given to region like WAFU
  countries: [{ type: Schema.Types.ObjectId, ref: 'Country' }], // array of country Ids in the region
})

// Define methods for the Territory schema
territorySchema.methods = {
  // Create a new territory
  async createTerritory(name, countries = []) {
    try {
      const newTerritory = new this({ name, countries })
      return await newTerritory.save()
    } catch (error) {
      throw new Error(`Error creating territory: ${error.message}`)
    }
  },

  // Update territory name and save
  async updateTerritoryName(newName) {
    try {
      this.name = newName
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating territory name: ${error.message}`)
    }
  },

  // Update territory countries and save
  async updateTerritoryCountries(newCountries) {
    try {
      this.countries = newCountries
      return await this.save()
    } catch (error) {
      throw new Error(`Error updating territory countries: ${error.message}`)
    }
  },

  // Remove a countryId from countries array and save
  async removeCountry(countryId) {
    try {
      this.countries.pull(countryId)
      return await this.save()
    } catch (error) {
      throw new Error(`Error removing country: ${error.message}`)
    }
  },

  // Delete a territory
  async deleteTerritory() {
    try {
      return await this.remove()
    } catch (error) {
      throw new Error(`Error deleting territory: ${error.message}`)
    }
  },
}

// Create the Category model
export const Category = model('Category', categorySchema)
// Create SubCategory model
export const SubCategory = model('SubCategory', subCategorySchema)
// Create  Country model
export const Country = model('Country', countrySchema)
// Create Territory model
export const Territory = model('Territory', territorySchema)
