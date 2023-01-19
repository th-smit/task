const express = require('express')
const router = express.Router();
const { getmovies,findmovies,addmovies,updatemovies,deletemovies } = require("../controller/controller")

router.get('/',getmovies)

router.get('/:id',findmovies)

router.post('/',addmovies)

router.put('/:id',updatemovies)

router.delete('/:id',deletemovies)

module.exports = router