import mongoose from 'mongoose'
import PokeCard from '../models/pokeCard.js'
import axios from 'axios'

export const getPokemon = async (req, res) => {
    const { id: _id } = req.params

    try {
        const pokemon = await PokeCard.findById(_id)
        
        const NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${process.env.NEWS_API_KEY}&q=${pokemon.pokemon_name}`
        
        const articles = (await axios.get(NEWS_API_URL)).data.articles.slice(0, 8)
        console.log(articles);
        res.status(200).json({data: {...pokemon._doc, articles}})
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export const getPokemons = async (req, res) => {
    let { page } = req.query

    try {
        if(!page) page = 1
        
        const LIMIT = 6
        const startIndex = (Number(page) - 1) * LIMIT
        const total = await PokeCard.countDocuments({})

        const pokemons = await PokeCard.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)

        res.status(200).json({ data: pokemons, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export const getPokemonsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query

    try {
        if (searchQuery === 'none' && tags.length === 0) {
            const pokemons = await PokeCard.find().sort({ _id: -1 }).limit(6)
            res.status(200).json({ data: pokemons })
        } else {
            const pokemon_name = new RegExp(searchQuery, 'i')
            const pokemons = await PokeCard.find({ $or: [{ pokemon_name }, { tags: { $in: tags.split(',') } }] })

            res.status(200).json({ data: pokemons })
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export const createPokemon = async (req, res) => {
    const pokemon = req.body
    const newPokemon = new PokeCard({ ...pokemon, creator: req.userId, createdAt: new Date().toISOString() })
    try {
        await newPokemon.save()
        res.status(201).json(newPokemon)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}


export const updatePokemon = async (req, res) => {
    const { id: _id } = req.params
    const pokemon = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No poke card with that id')

    const updatedPokemon = await PokeCard.findByIdAndUpdate(_id, { ...pokemon, _id }, { new: true })

    res.json(updatedPokemon)
}


export const deletePokemon = async (req, res) => {
    const { id: _id } = req.params

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No poke card with that id')

    const deletedPokemon = await PokeCard.findByIdAndRemove(_id)

    res.json(deletedPokemon)
}


export const likePokemon = async (req, res) => {
    const { id: _id } = req.params

    if (!req.userId) return res.json({ message: 'Please authenticate' })

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No poke card with that id')

    const pokemon = await PokeCard.findById(_id)

    const index = pokemon.likes.findIndex(id => id === String(req.userId))
    if (index === -1) {
        pokemon.likes.push(req.userId)
    } else {
        pokemon.likes = pokemon.likes.filter(id => id !== String(req.userId))
    }

    const updatedPokemon = await PokeCard.findByIdAndUpdate(_id, pokemon, { new: true })

    res.json(updatedPokemon)
}


export const commentPokemon = async (req, res) => {
    const { id } = req.params
    const { value } = req.body

    const pokemon = await PokeCard.findById(id)

    pokemon.comments.push(value)

    const updatedPokemon = await PokeCard.findByIdAndUpdate(id, pokemon, { new: true })

    res.json(updatedPokemon)
}