import express from "express";
import courseRoutes from "./routes/course.route.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/courses", courseRoutes);
app.use("/auth", userRoutes);
export default app;
