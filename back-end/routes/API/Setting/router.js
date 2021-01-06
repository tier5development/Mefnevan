const router      = require('express').Router()
const controller  = require('./controller')



router.post('/autoresponder',
controller.autoresponder  
)

router.post('/updateautoresponder',
controller.updateautoresponder  
)

router.post('/createautorespondergroup',
controller.createautorespondergroup  
)

router.post('/getautoresponderkeywords',
controller.getautoresponderkeywords  
)

module.exports = router