import express from 'express'
import { getUser, createUser, deleteUser, updateUser } from '../controllers/userController.js'

const router = express.Router()

router.get('/users', getUser)
router.post('/users', createUser)
router.delete('/users/:id', deleteUser)
router.put('/users/:id', updateUser)

export default router;