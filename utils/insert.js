import allGame from "../data/allGame.js";
import { allProvider } from "../data/allProvider.js";
import gameListModel from "../model/gameListModel.js";
import providerModel from "../model/providerModel.js";


export const seedGames = async () => {
  try {
    // await connectDB();

    // Optional: purana data delete
    await providerModel.deleteMany({});
    console.log("🗑 Old provider data removed");

    // Insert new data
    await providerModel.insertMany(allProvider);
    console.log("✅ Provider data inserted successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

