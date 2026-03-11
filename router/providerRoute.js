import express from "express";

import { addProvider, getAllProviders, updateProvider, updateProviderStatus } from "../controller/providerController.js";
import adminAuth from "../midellware.js/adminAuth.js";

const router = express.Router();

router.get("/provider",adminAuth, getAllProviders);
router.post("/add-provider",adminAuth, addProvider);
router.put("/update-provider/:id",adminAuth, updateProvider);
router.post("/active-unactive/provider/:id",adminAuth, updateProviderStatus);


export default router;
