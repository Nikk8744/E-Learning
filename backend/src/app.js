import express from "express"
import cookieParser from 'cookie-parser'
import cors from "cors"

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser())

// app.use(cors({
//     origin: 'http://localhost:', 
//     credentials: true, 
// }));

// import Routes 
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import notificationRoutes from "./routes/notification.js";
import cartRoutes from "./routes/cart.js";

// declare routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/cart", cartRoutes);

export { app }  


// course 3 type
// time
// cart
// notification
// course list update delete
// admin can see all course list 
// whishlist
