import express, {RequestHandler } from 'express';
import { login, logout, register } from '../controller/authController';


const router = express.Router();

//Register a new user

router.post('/register', register as RequestHandler);

// LOGIN A USER

router.post('/login', login as RequestHandler);

// Logout a user

router.post('/logout', logout as RequestHandler);

export default router;
