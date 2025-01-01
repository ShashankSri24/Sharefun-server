import express from 'express'
import { Login, logout, Register } from '../Controller/SignUP.js';
import { VerifyEmail } from '../Controller/Verification.js';


const router = express.Router();
// user router for register
router.post('/register',Register);
router.post('/verify-email',VerifyEmail)

//login / logout Router
router.post('/login',Login);
router.post('/logout',logout);

export default router; 
