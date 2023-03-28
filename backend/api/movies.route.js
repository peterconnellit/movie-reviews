import express from 'express'
import MoviesController from './movies.controller.js'
import ReviewsController from './reviews.controller.js'

//access to express router
const router = express.Router()

//URL request calls MoviesController.apiGetMovies
router.route('/').get(MoviesController.apiGetMovies)
//retrieve a specific movie and all associated reviews
router.route("/id/:id").get(MoviesController.apiGetMovieById)
//returns a list of movie ratings, intended for front-end drop-down menu
router.route("/ratings").get(MoviesController.apiGetRatings)

//handles all requests within one route call, depending on http request
router
    .route("/review")
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)

export default router