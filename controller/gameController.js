import crypto from "crypto";
import gameListModel from "../model/gameListModel.js";

export const AES_KEY = "ca51aaabb5e8725f29cd42aa29623b48";
export const AGENCY_UID = "1b6ad0c8122f6b07955595984682e752";
export const SERVER_URL = "https://huidu.bet";
// import db from "../db/index.js";
import gameModel from "../model/gameModel.js";

export const aesEncrypt = (data, key) => {
  const cipher = crypto.createCipheriv(
    "aes-256-ecb",
    Buffer.from(key, "utf8"),
    null
  );
  cipher.setAutoPadding(true);

  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
};


export const getGameDetails = async (req, res) => {

    try {
        const {id, gametype_list, game_type, provider_list, provider, size, page} = req.query
    
        // console.log("game_type",game_type);
      
    /* ---------- PROVIDER LIST ---------- */
    if (provider_list == 1) {
      const providers = await gameListModel.distinct("provider");

      return res.json({
        status: true,
        message: "Provider list fetched successfully.",
        providers
      });
    }

    /* ---------- GAME TYPE LIST ---------- */
    if (gametype_list == 1) {
      const gameTypes = await gameListModel.distinct("game_type");

      return res.json({
        status: true,
        message: "Game type list fetched successfully.",
        game_types: gameTypes
      });
    }

    /* ---------- FILTER ---------- */
    const filter = {};

    if (provider) {
      filter.provider = provider;
    }

    if (game_type) {
      filter.game_type = game_type;
    }
    if (id) {
      filter.id = id;
    }

    /* ---------- PAGINATION ---------- */
    const pageSize = Number(size) || 1000;
    const pageNumber = Number(page) || 1;
    const skip = (pageNumber - 1) * pageSize;

    const totalGames = await gameListModel.countDocuments(filter);
    const games = await gameListModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .select("game_name game_uid game_type provider icon");

    return res.json({
      status: true,
      message: "Game data fetched successfully.",
      total_games: totalGames,
      current_page: pageNumber,
      per_page: pageSize,
      data: games
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message
    });
  }
};





