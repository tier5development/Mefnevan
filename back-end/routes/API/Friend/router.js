const router      = require('express').Router()
const controller  = require('./controller')


router.post('/friendsCreateOrUpdate',
controller.FriendsCreateOrUpdate
)

router.post('/friendsUpdate',
controller.FriendsUpdate
)

router.post('/friendsDefaultMessageCheck',
controller.friendsDefaultMessageCheck
)

router.post('/friendsUpdateDefaut',
controller.friendsUpdateDefaut
)
module.exports = router