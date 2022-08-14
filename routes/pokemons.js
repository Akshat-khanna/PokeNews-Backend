import express from 'express'

import { getPokemonsBySearch, getPokemon, getPokemons, createPokemon, updatePokemon, deletePokemon, likePokemon, commentPokemon } from '../controllers/pokemons.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/search', getPokemonsBySearch)
router.get('/', getPokemons)
router.get('/:id', getPokemon)

router.post('/', auth, createPokemon)
router.patch('/:id', auth, updatePokemon)
router.delete('/:id', auth, deletePokemon)
router.patch('/:id/likePokemon', auth, likePokemon)
router.post('/:id/commentPokemon', auth, commentPokemon)

export default router