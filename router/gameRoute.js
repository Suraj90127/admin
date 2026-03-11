import express from "express";

import { getGameDetails } from './../controller/gameController.js';
import adminAuth from "../midellware.js/adminAuth.js";

const router = express.Router();

router.get("/games",adminAuth, getGameDetails);

export default router;
