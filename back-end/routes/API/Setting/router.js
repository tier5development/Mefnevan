const router      = require('express').Router()
const controller  = require('./controller')



router.post('/autoresponder',
controller.autoresponder  
)

router.post('/updateautoresponder',
controller.updateautoresponder  
)

router.post('/setsetting',
controller.setsetting
)

router.post('/createautorespondergroup',
controller.createautorespondergroup  
)

router.post('/getautoresponderkeywords',
controller.getautoresponderkeywords  
)

router.post('/getSetting',
controller.getSetting
)

module.exports = router