import CricketProvider from "../model/CricketProviderModel.js";

export const createCricketProvider = async (req, res) => {
  try {
    const provider = await CricketProvider.create(req.body);

    res.status(201).json({
      success: true,
      message: "Cricket Provider Created Successfully",
      data: provider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllCricketProviders = async (req, res) => {
  try {
    const providers = await CricketProvider.find();

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCricketProviderById = async (req, res) => {
  try {
    const provider = await CricketProvider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCricketProvider = async (req, res) => {
  try {
    const provider = await CricketProvider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Provider Updated Successfully",
      data: provider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteCricketProvider = async (req, res) => {
  try {
    const provider = await CricketProvider.findByIdAndDelete(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Provider Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};