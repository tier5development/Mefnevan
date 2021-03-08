const router      = require('express').Router()
const controller  = require('./controller')



router.post('/create',
controller.createSegment  
)
router.post('/list',
controller.listSegment  
)
router.post('/edit',
controller.editSegment  
)
module.exports = router