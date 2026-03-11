import UserProviderAccess from "../model/userProviderAccessModel.js";

export const getUserProviderAccessByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const access = await UserProviderAccess.findOne({ userId }).populate(
      "userId",
      "name email"
    );

    if (!access) {
      return res.status(404).json({
        success: false,
        message: "Provider access not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: access,
    });
  } catch (error) {
    console.error("getUserProviderAccessByUserId error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};