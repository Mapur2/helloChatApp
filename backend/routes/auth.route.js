import express from 'express';
import { login, logout, onboard, signup } from '../controller/auth.controller.js';
import { verifyJWT } from '../lib/verifyJWT.js';

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.post('/onboarding',verifyJWT, onboard);

router.get("/me", verifyJWT, (req, res) => {
    res.status(200).json({success:true, user: req.user });
});

export default router;