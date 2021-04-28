const router      = require('express').Router()
const controller  = require('./controller')

router.post('/create',
controller.AutoResponderCreate  
)

router.post('/list',
controller.AutoResponderList  
)

router.post('/edit',
controller.AutoResponderEdit  
)

router.post('/update',
controller.AutoResponderUpdate  
)

router.post('/updateStatus',
controller.AutoResponderUpdateStatus  
)

router.post('/delete',
controller.AutoResponderDelete  
)
router.post('/backthrust_type_group',
controller.BackThrustAutoresponderTypeGroup
)

module.exports = router