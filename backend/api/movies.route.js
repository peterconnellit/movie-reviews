import express from 'express'

//access to express router
const router = express.Router()

router.route('/').get((req,res) => res.send('hello world'))

export default router