// create app
const express = require("express");
const app = express();

// import routes
const blogRoutes = require("./routes/Blogs");
const profileRoutes = require("./routes/Profile");
const userRoutes = require("./routes/User");

// import required modules and files
const database = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// env file
require("dotenv").config();

// define the port
const PORT = process.env.PORT || 3000;

// connect to database
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/user", userRoutes);

// default route
app.get("/", (res) => {
	return res.json({
		success:true,
		message:'Your server is up and running.',
	});
});

// start the app
app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
});