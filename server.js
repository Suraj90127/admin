import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { connectDB } from "./config/db.js";
// import { seedGames } from "./utils/insert.js";
import adminRouter from "./router/adminRoute.js";
import gameRouter from "./router/gameRoute.js";
import providerRoute from "./router/providerRoute.js";
import userRoute from "./router/userRoute.js";
import cricketProviderRoute from "./router/cricketProviderRoutes.js";
import UserProviderAccessroute from "./router/userProviderAccessRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;

const app = express();

/* =====================
   MIDDLEWARES
===================== */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);


app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173","http://localhost:5174", "http://localhost:5175"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan(process.env.LOG_FORMAT || "dev"));

/* =====================
   API ROUTES
===================== */
app.use("/admin", adminRouter);
app.use("/admin", gameRouter);
app.use("/admin", providerRoute);
app.use("/admin", userRoute);
app.use("/admin", UserProviderAccessroute);
app.use("/admin", cricketProviderRoute);
// seedGames();

/* =====================
   SERVE FRONTEND BUILD
===================== */
app.use(express.static(path.join(__dirname, "client/dist")));

app.get(/^(?!\/admin).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});


/* =====================
   START SERVER
===================== */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http:${PORT}`);
});



