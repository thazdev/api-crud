import express from 'express'
import { getUser, createUser, deleteUser, updateUser, registerUser, loginUser } from '../controllers/userController.js'
import { validateUser } from '../middlewares/validation.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/users', authenticateToken, getUser)

router.post('/users', validateUser, authenticateToken, createUser)
router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)   

router.delete('/users/:id', authenticateToken, deleteUser)

router.put('/users/:id', authenticateToken, validateUser, updateUser)

export default router; 

