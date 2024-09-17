import express from "express"
import cookieParser from 'cookie-parser'

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser())

// import Routes 
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";

// declare routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/course", courseRoutes);

export { app }