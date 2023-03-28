//access app in server.js, database and environment variables.
import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import MoviesDAO from './dao/moviesDAO.js'
import ReviewsDAO from './dao/reviewsDAO.js'

//connect to MongoDB cluster and call functions
async function main(){

    //load environment variables
    dotenv.config()

    //create instance of MongoClient and pass in database URI
    const client = new mongodb.MongoClient(
        process.env.MOVIEREVIEWS_DB_URI
    )
    //retrieve port from access .env or use port 8000
    const port = process.env.PORT || 8000
    
    //try catch error handling
    //call client.connect and return a promise, await blocks further action until operation has completed
    try{
        //connect to the Mongodb cluster
        await client.connect()
        //injectDB() called, before server starts, to get initial reference to the database movies and reviews collections
        await MoviesDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)

        //after connection, start web server
        app.listen(port, () =>{
            console.log('server is running on port: '+port)
        })
    } catch (e){
        console.error(e);
        process.exit(1)
    }
}

//can be called to send errors to the console
main().catch(console.error);