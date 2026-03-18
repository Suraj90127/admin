import adminModel from '../model/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Recharge from '../model/rechargeModel.js';
import User from '../model/UserModel.js';
import Provider from '../model/providerModel.js';
import GameList from '../model/gameListModel.js';
import UserProviderAccess from '../model/userProviderAccessModel.js';
import cricketAccess from '../model/cricketGameAccess.js';
import paymentmethod from '../model/paymentmethod.js';
import axios from "axios";

// Register Controller
export const register = async (req, res) => {

  // console.log("req.body",req.body);

  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if admin exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new adminModel({
      username,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role, by:admin.by },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store token in cookie
    res.cookie('token', token, { httpOnly: true, secure: true });


    // await user.save();
    await admin.save();
    res.status(201).json({
      success: true,
      admin,
      message: 'Admin registered successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role, by:admin.by },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store token in cookie
    res.cookie('token', token, { httpOnly: true, secure: true });



    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get Admin Info Controller
export const getAdminInfo = async (req, res) => {
  const { id } = req;

  try {
    const adminId = id; // Assuming userId is set in the request after authentication

    // Find admin by ID
    const admin = await adminModel.findById(adminId).select('-password'); // Exclude password from response
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// export const totalManager1 = async (req, res) => {
//   const {by}= req
//   try {
//     // 🔹 USERS
//     const totalUsers = await User.countDocuments();
//     const totalActiveUsers = await User.countDocuments({ isActive: 1 });
//     const totalDeactiveUsers = await User.countDocuments({ isActive: 0 });

//     // 🔹 TOTAL SALES (ONLY SUCCESS PAYMENTS)
//     const salesResult = await Recharge.aggregate([
//       { $match: { status: 1 } },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: "$money" }
//         }
//       }
//     ]);
//     // 🔹 TOTAL SALES (ONLY SUCCESS PAYMENTS)
//     const pending = await Recharge.aggregate([
//       { $match: { status: 0 } },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: "$money" }
//         }
//       }
//     ]);

//     const totalSales =
//       salesResult.length > 0 ? salesResult[0].totalSales : 0;

//     const totalPendingRecharge =
//       pending.length > 0 ? pending[0].totalSales : 0;

//     // 🔹 PROVIDERS
//     const totalProviders = await Provider.countDocuments();

//     // 🔹 GAMES
//     const totalGames = await GameList.countDocuments();

//     return res.status(200).json({
//       status: true,
//       data: {
//         totalUsers,
//         totalActiveUsers,
//         totalDeactiveUsers,
//         totalSales,
//         totalPendingRecharge,
//         totalProviders,
//         totalGames,
//       },
//     });
//   } catch (error) {
//     console.error("totalManager error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// };


export const totalManager = async (req, res) => {
  const { by } = req;

  try {

    // 🔹 USERS (FILTERED BY TENANT)
    const totalUsers = await User.countDocuments({ by });

    const totalActiveUsers = await User.countDocuments({
      by,
      isActive: 1
    });

    const totalDeactiveUsers = await User.countDocuments({
      by,
      isActive: 0
    });


    // 🔹 TOTAL SALES (SUCCESS PAYMENTS)
    const salesResult = await Recharge.aggregate([
      {
        $match: {
          by: by,
          status: 1
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$money" }
        }
      }
    ]);


    // 🔹 PENDING RECHARGE
    const pending = await Recharge.aggregate([
      {
        $match: {
          by: by,
          status: 0
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$money" }
        }
      }
    ]);

    console.log("pending",pending);
    

    const totalSales =
      salesResult.length > 0 ? salesResult[0].totalSales : 0;

    const totalPendingRecharge =
      pending.length > 0 ? pending[0].totalSales : 0;


    // 🔹 PROVIDERS (GLOBAL)
    const totalProviders = await Provider.countDocuments();

    // 🔹 GAMES (GLOBAL)
    const totalGames = await GameList.countDocuments();


    return res.status(200).json({
      status: true,
      data: {
        totalUsers,
        totalActiveUsers,
        totalDeactiveUsers,
        totalSales,
        totalPendingRecharge,
        totalProviders,
        totalGames,
      },
    });

  } catch (error) {

    console.error("totalManager error:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });

  }
};

export const getTotalRechargeData = async (req, res) => {
  const { by } = req;

  try {

    const recharges = await Recharge
      .find({ by })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      recharges,
      message: ""
    });

  } catch (error) {

    console.error("getRechargeHistory error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

// export const rechargeDuet = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const statusNum = Number(req.body.status); // 0=pending, 1=approve, 2=reject

//     if (!id || ![0, 1, 2].includes(statusNum)) {
//       return res.status(400).json({
//         success: false,
//         message: "Recharge id and valid status (0,1,2) required",
//       });
//     }

//     const recharge = await Recharge.findById(id);
//     if (!recharge) {
//       return res.status(404).json({
//         success: false,
//         message: "Transaction not found",
//       });
//     }

//     const oldStatus = recharge.status;

//     const user = await User.findById(recharge.userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
    
//     let amount = Number(recharge.money || 0);
//     // console.log("amount1",amount);
    

//     if (recharge.method === "USDT") {
//       amount = Number(recharge.money  || 0)*92;
//     }

//     // console.log("amount", amount);
    
      


//     /* =====================================================
//        ❌ REJECT (always allowed, no balance effect)
//        ===================================================== */
//     if (statusNum === 2) {
//       await Recharge.findByIdAndUpdate(
//         recharge._id,
//         { $set: { status: 2 } },
//         { new: true }
//       );

//       return res.json({
//         success: true,
//         message: "Recharge rejected successfully",
//       });
//     }

//     /* =====================================================
//        ⏳ PENDING (admin can reset to pending)
//        ===================================================== */
//     if (statusNum === 0) {
//       await Recharge.findByIdAndUpdate(
//         recharge._id,
//         { $set: { status: 0 } },
//         { new: true }
//       );

//       return res.json({
//         success: true,
//         message: "Recharge set to pending",
//       });
//     }

//     /* =====================================================
//        ✅ APPROVE
//        ===================================================== */
//     if (statusNum === 1) {

//       // 🔥 CREDIT ONLY IF NOT ALREADY APPROVED
//       if (oldStatus !== 1) {

//         /* ---------- PROVIDER BUY ---------- */
//         if (recharge.type === "provider_buy") {
//           const access = await UserProviderAccess.findOne({ userId: user._id });

//           if (access) {
//             access.providers = access.providers.map(p =>
//               p.status === 0 ? { ...p, status: 1 } : p
//             );

//             access.totalPayAmount = 0;
//             access.totalAmount = access.providers.reduce(
//               (sum, p) => sum + Number(p.price || 0),
//               0
//             );

//             user.balance += amount;
//             user.totalggr += amount;
//             user.isActive = 1;

//             await access.save();
//             await user.save();
//           }
//         }

//         /* ---------- CRICKET ---------- */
//         else if (recharge.type === "cricket") {
//           const cricketaccess = await cricketAccess.findOne({
//             userId: user._id,
//           });

//           if (!cricketaccess) {
//             return res.status(404).json({
//               success: false,
//               message: "Cricket subscription not initiated",
//             });
//           }

//           const months = Number(cricketaccess.months || 0);
//           const paid = Number(cricketaccess.totalPayAmount || 0);
//           const now = new Date();

//           if (months <= 0) {
//             return res.status(400).json({
//               success: false,
//               message: "Invalid cricket months",
//             });
//           }

//           const baseDate =
//             cricketaccess.isActive === 1 &&
//             cricketaccess.endDate &&
//             cricketaccess.endDate > now
//               ? cricketaccess.endDate
//               : now;

//           const newEnd = new Date(baseDate);
//           newEnd.setMonth(newEnd.getMonth() + months);

//           cricketaccess.isActive = 1;
//           cricketaccess.startDate = cricketaccess.startDate || now;
//           cricketaccess.endDate = newEnd;
//           cricketaccess.expiresAt = newEnd;
//           cricketaccess.totalPayAmount = 0;

//           user.cricketBalence = (user.cricketBalence || 0) + paid;
//           user.isActive = 1;

//           await cricketaccess.save();
//           await user.save();
//         }

//         /* ---------- NORMAL WALLET ---------- */
//         else {
//           user.balance += amount;
//           user.totalggr += amount;
//           user.isActive = 1;
//           await user.save();
//         }
//       }

//       // 🔥 STATUS UPDATE ALWAYS (even re-approve)
//       await Recharge.findByIdAndUpdate(
//         recharge._id,
//         { $set: { status: 1 } },
//         { new: true }
//       );

//       return res.json({
//         success: true,
//         message:
//           oldStatus === 1
//             ? "Recharge already approved (status updated)"
//             : "Recharge approved successfully",
//       });
//     }

//     return res.status(400).json({
//       success: false,
//       message: "Invalid status value",
//     });

//   } catch (error) {
//     console.error("RechargeDuet error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };


const roundToTwo = (num) => {
  return Number(Number(num).toFixed(2));
};

export const rechargeDuet = async (req, res) => {
  try {
    const { id } = req.params;
    const statusNum = Number(req.body.status); // 0=pending, 1=approve, 2=reject

    if (!id || ![0, 1, 2].includes(statusNum)) {
      return res.status(400).json({
        success: false,
        message: "Recharge id and valid status (0,1,2) required",
      });
    }

    const recharge = await Recharge.findById(id);
    if (!recharge) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const oldStatus = recharge.status;

    const user = await User.findById(recharge.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let amount = Number(recharge.money || 0);

    if (recharge.method === "USDT") {
      amount = Number(recharge.money || 0) * 92;
    }

    amount = roundToTwo(amount);

    if (statusNum === 2) {
      await Recharge.findByIdAndUpdate(
        recharge._id,
        { $set: { status: 2 } },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Recharge rejected successfully",
      });
    }

    if (statusNum === 0) {
      await Recharge.findByIdAndUpdate(
        recharge._id,
        { $set: { status: 0 } },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Recharge set to pending",
      });
    }

    if (statusNum === 1) {
      if (oldStatus !== 1) {
        if (recharge.type === "provider_buy") {
          const access = await UserProviderAccess.findOne({ userId: user._id });

          if (access) {
            access.providers = access.providers.map((p) =>
              p.status === 0 ? { ...p, status: 1 } : p
            );

            access.totalPayAmount = 0;
            access.totalAmount = roundToTwo(
              access.providers.reduce((sum, p) => sum + Number(p.price || 0), 0)
            );

            user.balance = roundToTwo((user.balance || 0) + amount);
            user.totalggr = roundToTwo((user.totalggr || 0) + amount);
            user.isActive = 1;

            await access.save();
            await user.save();
          }
        } else if (recharge.type === "cricket") {
          const cricketaccess = await cricketAccess.findOne({
            userId: user._id,
          });

          if (!cricketaccess) {
            return res.status(404).json({
              success: false,
              message: "Cricket subscription not initiated",
            });
          }

          const months = Number(cricketaccess.months || 0);
          const paid = Number(cricketaccess.totalPayAmount || 0);
          const now = new Date();

          if (months <= 0) {
            return res.status(400).json({
              success: false,
              message: "Invalid cricket months",
            });
          }

          const baseDate =
            cricketaccess.isActive === 1 &&
            cricketaccess.endDate &&
            cricketaccess.endDate > now
              ? cricketaccess.endDate
              : now;

          const newEnd = new Date(baseDate);
          newEnd.setMonth(newEnd.getMonth() + months);

          cricketaccess.isActive = 1;
          cricketaccess.startDate = cricketaccess.startDate || now;
          cricketaccess.endDate = newEnd;
          cricketaccess.expiresAt = newEnd;
          cricketaccess.totalPayAmount = 0;

          user.cricketBalence = roundToTwo(
            (user.cricketBalence || 0) + paid
          );
          user.isActive = 1;

          await cricketaccess.save();
          await user.save();
        } else {
          user.balance = roundToTwo((user.balance || 0) + amount);
          user.totalggr = roundToTwo((user.totalggr || 0) + amount);
          user.isActive = 1;
          await user.save();
        }
      }

      await Recharge.findByIdAndUpdate(
        recharge._id,
        { $set: { status: 1 } },
        { new: true }
      );

      return res.json({
        success: true,
        message:
          oldStatus === 1
            ? "Recharge already approved (status updated)"
            : "Recharge approved successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  } catch (error) {
    console.error("RechargeDuet error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export const updateAdminPaymentDetails = async (req, res) => {
  try {
    const { usdtAddress, upi } = req.body;

    if (!usdtAddress && !upi && !req.file) {
      return res.status(400).json({
        success: false,
        message: "At least one field (usdtAddress, upi, or usdtImage) is required",
      });
    }

    const updateData = {};

    if (usdtAddress) updateData.usdtAddress = usdtAddress;
    if (upi) updateData.upi = upi;

    /* =============================
       📸 Upload USDT Image to imgbb
    ============================== */
    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");

      const imgbbRes = await axios.post(
        "https://api.imgbb.com/1/upload",
        null,
        {
          params: {
            key: process.env.IMGBB_API_KEY,
            image: base64Image,
          },
        }
      );

      updateData.usdtImage = imgbbRes.data.data.url;
    }

    // 🔒 sirf ek hi document rahega
    const paymentMethod = await paymentmethod.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment details updated successfully",
      data: paymentMethod,
    });

  } catch (error) {
    console.error("Update Admin Payment Error:", error?.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};