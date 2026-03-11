
import express, { Router } from 'express';
import { register, login, getAdminInfo, totalManager, getTotalRechargeData, rechargeDuet, logout, updateAdminPaymentDetails } from '../controller/adminController.js';
import adminAuth from '../midellware.js/adminAuth.js';
import multer from "multer";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post('/register', register);
router.post('/login', login);
router.get('/info', adminAuth, getAdminInfo);
router.get('/total-manager',adminAuth, totalManager);
router.get('/total-recharge/data',adminAuth, getTotalRechargeData);
// router.post('/recharge-duet/:id', rechargeDuet);
router.post("/logout", logout);
router.get('/total-manager', adminAuth, totalManager);
router.get('/total-recharge/data', adminAuth, getTotalRechargeData);
router.post('/recharge-duet/:id', adminAuth, rechargeDuet);
router.put(
    "/update-payment",
    adminAuth,
    upload.single("usdtImage"), // 👈 image field
    updateAdminPaymentDetails
);


export default router;