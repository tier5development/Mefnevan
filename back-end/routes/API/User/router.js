const router      = require('express').Router()
const controller  = require('./controller')



router.post('/userfacebook',
controller.userFacebook  
)


module.exports = router