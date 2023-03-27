import express from 'express'
import MoviesController from './movies.controller.js'

//access to express router
const router = express.Router()

//URL request calls MoviesController.apiGetMovies
router.route('/').get(MoviesController.apiGetMovies)

export default router