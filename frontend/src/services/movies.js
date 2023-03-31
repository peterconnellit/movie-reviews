//axios library for sending get, post, put and delete requests
import axios from "axios"

//contains functions for API calls to backend endpoints
class MovieDataService{

    //returns all movies for a particular page (default 0) using axios get method. Served by apiGetMovies in MoviesController
    getAll(page = 0){
        return axios.get(`http://localhost:5000/api/v1/movies?page=${page}`)
    }

    //gets specific movie by id, endpoint served by apiGetMoviesById in MoviesController
    get(id){
        return axios.get(`http://localhost:5000/api/v1/movies/id/${id}`)
    }

    //same endpoint as getAll except with a query containing user entries: search title, ratings and page number
    find(query, by = "title", page = 0){
        return axios.get(`http://localhost:5000/api/v1/movies?${by}=${query}&page=${page}`)
    }

    //last four methods to create, update, delete reviews and get all ratings
    createReview(data){
        return axios.post("http://localhost:5000/api/v1/movies/review", data)
    }

    updateReview(data){
        return axios.put("http://localhost:5000/api/v1/movies/review", data)
    }

    deleteReview(id, userId){
        return axios.delete("http://localhost:5000/api/v1/movies/review", {data:{review_id: id, user_: userId}})
    }

    getRatings(){
        return axios.get("http://localhost:5000/api/v1/movies/ratings")
    }
}

export default new MovieDataService()