import providerModel from "../model/providerModel.js";
// import Counter from "../models/counter.js";



export const getAllProviders = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status !== undefined) filter.status = Number(req.query.status);
        const providers = await providerModel.find(filter).sort({ createdAt: -1 }).lean();
        return res.status(200).json({ success: true, data: providers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch providers' });
    }
};

export const updateProviderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    // const { status } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Provider id is required" });
    }

    const provider = await providerModel.findOne({id})

    let status = provider.status===1 ? 0 : 1

    const updatedProvider = await providerModel.findOneAndUpdate(
      { id: id },                 // ✅ FILTER OBJECT
      { status: status },  // ✅ UPDATE
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProvider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    return res.status(200).json({
      success: true,
      data: updatedProvider
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update provider status"
    });
  }
};


export const addProvider = async (req, res) => {
  try {
    const { provider, img, price, path, status } = req.body;

    if (!provider) {
      return res.status(400).json({
        success: false,
        message: "provider is required"
      });
    }

    const existingProvider = await providerModel.findOne({ provider });
    if (existingProvider) {
      return res.status(409).json({
        success: false,
        message: "Provider already exists"
      });
    }

    const totalProviders = await providerModel.countDocuments();
    const nextId = totalProviders + 1;

    const newProvider = new providerModel({
      id: String(nextId),
      provider,
      img: img || "",
      price: price || 0,
      path: path || "",
      status: status ?? 1
    });

    await newProvider.save();

    return res.status(201).json({
      success: true,
      message: "Provider added successfully",
      data: newProvider
    });

  } catch (error) {
    console.error("Add Provider Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { img, price, status } = req.body;

    console.log("id",id);
    

    if (!id) {
      return res.status(400).json({ success: false, message: "Provider id is required" });
    }

    const updateData = {};
    if (img !== undefined) updateData.img = img;
    if (price !== undefined) updateData.price = price;
    if (status !== undefined) updateData.status = status;

    const updatedProvider = await providerModel.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProvider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Provider updated successfully",
      data: updatedProvider
    });

  } catch (error) {
    console.error("Update Provider Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};