import express from "express";
import courseRoutes from "./routes/course.route.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/courses", courseRoutes);
app.use("/auth", userRoutes);
app.use("/admin", adminRoutes);
app.use(errorHandler);
export default app;
