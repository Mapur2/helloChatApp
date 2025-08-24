import express from 'express';
import { verifyJWT } from '../lib/verifyJWT.js';
import { getStreamToken } from '../controller/chat.controller.js';

const router = express.Router();

router.get("/token",verifyJWT, getStreamToken)

export default router;