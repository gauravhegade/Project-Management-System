const express = require('express')
const router = express.Router()

const subjectController = require('../controllers/subjectController')

router.post('/create-subject',subjectController.createSubject)

module.exports = router

