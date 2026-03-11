import express from "express";
import  {getUserProviderAccessByUserId}  from "../controller/userProviderAccessController.js";

const router = express.Router();

router.get("/user/:userId", getUserProviderAccessByUserId);

export default router;