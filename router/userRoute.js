
import express from 'express';
import { deactivateUser, deleteUser, getAllCricketAccessUsers, getAllUsers, getUserById, updateUser } from '../controller/userController.js';
import adminAuth from '../midellware.js/adminAuth.js';

const router = express.Router();


// GET /users - Get all users
router.get('/get-user',adminAuth, getAllUsers);

// GET /users/:id - Get user by ID
router.get('/get-user/:id', adminAuth, getUserById);

// PUT /users/:id - Update user by ID
router.put('/user/update/:id', adminAuth, updateUser);

// DELETE /users/:id - Delete user by ID
router.delete('/user/delete/:id', adminAuth, deleteUser);

router.put('/user/act-deactive/:id',adminAuth, deactivateUser);

router.get("/cricket/users", adminAuth, getAllCricketAccessUsers)

export default router;