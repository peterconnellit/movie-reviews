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
}