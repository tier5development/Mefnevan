const router      = require('express').Router()
const controller  = require('./controller')



router.post('/getSetting',
controller.getSetting  
)

router.post('/setsetting',
controller.setSetting  
)

module.exports = router