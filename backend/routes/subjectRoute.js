const express = require('express')
const router = express.Router()

const subjectController = require('../controllers/subjectController')

router.post('/create-subject',subjectController.createSubject)
router.get('/get-subject-details',subjectController.getSubjectDetails)
router.post('/modify-subject',subjectController.modifySubject)

module.exports = router

