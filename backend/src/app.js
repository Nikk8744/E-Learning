import express from "express"
import cookieParser from 'cookie-parser'
import cors from "cors"

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));

// import Routes 
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import notificationRoutes from "./routes/notification.js";
import cartRoutes from "./routes/cart.js";
import reviewerRoutes from "./routes/reviewer.js";
import reviewRoutes from "./routes/review.js";

// declare routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/reviewer", reviewerRoutes);
app.use("/api/v1/review", reviewRoutes);

export { app }  



// time
// admin can see all course list 
// whishlist

// reviewer module 

// after checkout course will be removed from cart and when payment is done the course should be added to enrolled courses.


