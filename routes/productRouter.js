const userController = require('../controllers/userController.js')
const authenticateToken = require('../helpers/authenticateToken');

// router
const router = require('express').Router()


// use routers
router.post('/addUser', userController.addUser)

router.get('/getAllUsers', userController.getAllUsers)

router.put('/updateUser/:id', authenticateToken,userController.updateUser)

router.put('/deleteUser', authenticateToken, userController.deleteUser)

router.get('/findUser', userController.findUser)

router.post('/loginUser', userController.loginUser)


module.exports = router