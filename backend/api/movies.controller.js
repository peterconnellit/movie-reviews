import { parse } from "dotenv"
import MoviesDAO from "../dao/moviesDAO.js"

export default class MoviesController{

    //import DAO
    static async apiGetMovies(req,res,next){

        //check if moviesPerPage exits, parse into an integer. Same fo query string
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20
        const page = req.query.page ? parseInt(req.query.page) : 0

        //empty filters object
        let filters = {}
        //check if rated or title query string exist, then add to filters object
        if(req.query.rated){
            filters.rated = req.query.rated
        }
        else if(req.query.title){
            filters.title = req.query.title
        }

        //call getMovies in moviesDAO, returns moviesList and totalNumMovies
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({filters, page, moviesPerPage})

        let response ={
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }
        //sends json response with the above response object to whoever calls this URL
        res.json(response)
    }
}