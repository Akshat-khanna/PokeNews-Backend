import mongoose from 'mongoose'

const pokemonSchema = mongoose.Schema({
    pokemon_name: String,
    description: String,
    name: String, // Name of the pokeCard creator
    creator: String, // UserId of the logged in person
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const PokeCard = mongoose.model('PokeCard', pokemonSchema)

export default PokeCard