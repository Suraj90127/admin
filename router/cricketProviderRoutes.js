import express from "express";
import {
  createCricketProvider,
  getAllCricketProviders,
  getCricketProviderById,
  updateCricketProvider,
  deleteCricketProvider,
} from "../controller/cricketProviderController.js";

const router = express.Router();

router.post("/create-cricket/provider", createCricketProvider);
router.get("/get-cricket/providers", getAllCricketProviders);
router.get("/get-cricket/provider/:id", getCricketProviderById);
router.put("/update-cricket/provider/:id", updateCricketProvider);
router.delete("/delete-cricket/provider/:id", deleteCricketProvider);

export default router;