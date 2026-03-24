// import User from "../model/UserModel.js";
// import cricketAccess from "../model/cricketGameAccess.js";

// // Get all users
// export const  getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.status(200).json(users);
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching users', error: err.message });
//     }
// };

// export const getUserById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user);
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching user', error: err.message });
//     }
// };

// // Delete a user by ID
// export const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedUser = await User.findByIdAndDelete(id);
//         if (!deletedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Error deleting user', error: err.message });
//     }
// };

// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     // console.log("updates",updates);
    

//     const allowedFields = [
//       "name",
//       "domain",
//       "ipv4_address",
//       "isActive",
//       "ipv6_address",
//       "balance",
//       "nativetggr",
//       "role",
//     ];

//     const updateData = {};

//     allowedFields.forEach(field => {
//       if (updates[field] !== undefined) {
//         updateData[field] = updates[field];
//       }
//     });

//     if (Object.keys(updateData).length === 0) {
//       return res.status(400).json({
//         status: false,
//         message: "No valid fields to update",
//       });
//     }

//     const user = await User.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     ).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "User updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("updateUser error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// };

// // Delete (deactivate) isActive user (set isActive to 0)
// export const deactivateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         let status = user.isActive === 1 ? 0 : 1;
//         const updatedUser = await User.findByIdAndUpdate(id, { isActive: status }, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({ message: `User ${status === 0 ? 'deactivated' : 'activated'} successfully`, user: updatedUser });
//     } catch (err) {
//         res.status(500).json({ message: 'Error deactivating user', error: err.message });
//     }
// };


// export const getAllCricketAccessUsers = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       search
//     } = req.query;

//     const query = {};

//     // 🔹 pagination
//     const skip = (Number(page) - 1) * Number(limit);

//     // 🔹 base query
//     let cricketQuery = cricketAccess
//       .find(query)
//       .populate({
//         path: "userId",
//         select: `
//           name email phone domain
//           balance cricketBalence totalggr
//           role isActive createdAt
//         `
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     let data = await cricketQuery;

//     // 🔍 optional search (name / email / phone)
//     if (search) {
//       const regex = new RegExp(search, "i");

//       data = data.filter(item =>
//         item.userId &&
//         (
//           regex.test(item.userId.name) ||
//           regex.test(item.userId.email) ||
//           regex.test(String(item.userId.phone))
//         )
//       );
//     }

//     const total = await cricketAccess.countDocuments(query);

//     return res.json({
//       success: true,
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       data
//     });

//   } catch (error) {
//     console.error("getAllCricketAccessUsers error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch cricket access users"
//     });
//   }
// };




import User from "../model/UserModel.js";
import cricketAccess from "../model/cricketGameAccess.js";

// Get all users
export const getAllUsers = async (req, res) => {
  const { by } = req;

  try {
    const users = await User.find({ by }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
};


// Get user by ID
export const getUserById = async (req, res) => {
  const { by } = req;

  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, by }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({
      message: "Error fetching user",
      error: err.message,
    });
  }
};


// Delete a user by ID
export const deleteUser = async (req, res) => {
  const { by } = req;

  try {
    const { id } = req.params;

    const deletedUser = await User.findOneAndDelete({
      _id: id,
      by
    });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting user",
      error: err.message,
    });
  }
};


// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      "name",
      "domain",
      "ipv4_address",
      "isActive",
      "ipv6_address",
      "balance",
      "nativetggr",
      "role",
      "ggr_coust"
    ];

    const updateData = {};

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    /* 🔹 Convert ipv4_address to array */
    if (updates.ipv4_address) {
      updateData.ipv4_address = updates.ipv4_address
        .split(",")
        .map(ip => ip.trim())
        .filter(ip => ip);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: "No valid fields to update",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      user,
    });

  } catch (error) {
    console.error("updateUser error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
// Activate / Deactivate user
export const deactivateUser = async (req, res) => {
  const { by } = req;

  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, by });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const status = user.isActive === 1 ? 0 : 1;

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, by },
      { isActive: status },
      { new: true }
    );

    res.status(200).json({
      message: `User ${status === 0 ? "deactivated" : "activated"} successfully`,
      user: updatedUser,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deactivating user",
      error: err.message,
    });
  }
};



// Cricket access users
export const getAllCricketAccessUsers = async (req, res) => {
  const { by } = req;

  try {
    const {
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const query = { by };

    let cricketQuery = cricketAccess
      .find(query)
      .populate({
        path: "userId",
        match: { by },
        select: `
          name email phone domain
          balance cricketBalence totalggr
          role isActive createdAt
        `,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    let data = await cricketQuery;

    if (search) {
      const regex = new RegExp(search, "i");

      data = data.filter(
        (item) =>
          item.userId &&
          (regex.test(item.userId.name) ||
            regex.test(item.userId.email) ||
            regex.test(String(item.userId.phone)))
      );
    }

    const total = await cricketAccess.countDocuments(query);

    return res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    });

  } catch (error) {
    console.error("getAllCricketAccessUsers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cricket access users",
    });
  }
};