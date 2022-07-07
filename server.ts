import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'

import libraryRoutes from './routes/libraryRoutes'
import collectionRoutes from './routes/collectionRoutes'

dotenv.config()

//express app
const app = express()

//midlleware
app.use(cors())
app.use(express.json())
app.use((req,res,next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use("/api/",libraryRoutes)
app.use("/api/", collectionRoutes)

//connect to DB
mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to DB & listening on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })
