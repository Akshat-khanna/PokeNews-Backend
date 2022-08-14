import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import pokemonRoutes from './routes/pokemons.js'
import userRoutes from './routes/users.js'

dotenv.config()

const app = express()

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())

app.use('/pokemons', pokemonRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.send('Hello to the PokeNews API!')
})

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.log(error.message))