const express = require('express')
const router = express.Router()

const groupController = require('../controllers/groupController')

router.get('/get-group-details',groupController.getGroupDetails)
router.post('/create-group',groupController.createGroup)
router.post('/remove-member',groupController.removeTeamMember)
router.post('/add-member',groupController.addTeamMember)

module.exports = router