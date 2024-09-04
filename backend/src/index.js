import { app } from "./app.js";
import connectDb from "./db/index.js";

process.loadEnvFile;

connectDb().then(app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT: ${process.env.PORT}`)
}))
.catch((err) => {
    console.log("MongoDB connceetion failed!!", err)
})
