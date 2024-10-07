import express from "express"
import cookieParser from 'cookie-parser'
import cors from "cors"

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser())

// app.use(cors({
//     origin: 'http://localhost:5173', 
//     credentials: true, 
// }));

// import Routes 
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import notificationRoutes from "./routes/notification.js";
import cartRoutes from "./routes/cart.js";
import reviewerRoutes from "./routes/reviewer.js";

// declare routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/reviewer", reviewerRoutes);

export { app }  



// time
// course list update delete
// admin can see all course list 
// whishlist

// reviewer 

// course by teacher - all the courses created by a teacher
// course a student has ennrolled in - all the courses a student has enrolled in 
// after checkout course will be removed from cart and when payment is done the course should be added to enrolled courses.


