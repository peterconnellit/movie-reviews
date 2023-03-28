import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

//reference to the database
let movies

//inject is called as soon as server starts and provides the database reference to movies
export default class MoviesDAO{
    static async injectDB(conn){
        if(movies){
            //if movies exists, return
            return
        }
        try{
            //else, connect to the database name
            movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection('movies')
        }
        catch(e){
            //if reference fails, send error message to console
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }

    /*method accepts a filter object as its first argument. Default filter has no filter, retrieves 20 movies per page, starting at page 0.
    This app uses "title" and "rated" to provide filtering results.*/
    static async getMovies({// default filter
        filters = null,
        page = 0,
        moviesPerPage = 20 //20 movies at once
    } = {}){
        let query
        if(filters){
            if("title" in filters){
                query = { $text: { $search: filters['title']}}
            }else if("rated" in filters){
                query = { "rated": { $eq: filters['rated']}}
            }
        }

        //fetches in batches to reduce memory consumption and bandwidth. limit() caps results to 20. limit() and skip() allow pagination
        let cursor
        try{
            cursor = await movies
                        .find(query)
                        .limit(moviesPerPage)
                        .skip(moviesPerPage * page)
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return {moviesList, totalNumMovies}
        }
        catch(e){
            console.error(`unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0}
        }
    }

    static async getRatings(){
        let ratings = []
        try{
            //movies.distinct returns rated values from the movies collection. We then assign them to the ratings array
            ratings = await movies.distinct("rated")
            return ratings
        }
        catch(e){
            console.error(`unable to get ratings, ${e}`)
            return ratings
        }
    }

    static async getMovieById(id){
        try{
            /*aggregate provides a sequence of data aggregation operations.
            For $match, we look for the movie document that matches the specified id.
            $lookup performs an equality join using the _id field from the movie document with the 
            movie_id field from the reviews collection*/
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                //finds all the reviews with the specific movie id and returns the specific movie together with the reviews in an array.
                //part of the mongoDB aggregation framework
                { $lookup:
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next()
        }
        catch(e){
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    }
    
}