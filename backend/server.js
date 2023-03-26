//import express and cors middleware. route.js stores routes
import express from 'express'
import cors from 'cors'
import movies from './api/movies.route.js'

//create server
const app = express()

app.use(cors())
//parsing middleware so server can read and accept JSON in a request's body
app.use(express.json())

//specify internal routes using general convention for API urls. Invalid route will result in wildcard used to return 404 'not found' message
app.use("/api/v1/movies", movies)
app.use("*", (req,res)=>{
    res.status(404).json({error: "not found"})
})

//module so other files can import. This method separates server and database code SoC
//https://www.castsoftware.com/pulse/how-to-implement-design-pattern-separation-of-concerns
export default app