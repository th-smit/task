const express = require('express')
const router = express.Router();
const { getMovies,findMovies,addMovies,updateMovies,deleteMovies } = require("../controller/movieController")

router.get('/',getMovies)

router.get('/:id',findMovies)

router.post('/',addMovies)

router.put('/:id',updateMovies)

router.delete('/:id',deleteMovies)

module.exports = router