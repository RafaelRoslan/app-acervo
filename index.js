import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/database/db.js";

// ROTAS — todos dentro de src/routes e com .route.js (singular)
import { scheduleExpireListingsJob } from './src/jobs/expire-listings.js';
import articleRoutes from "./src/routes/article.routes.js";
import login from "./src/routes/auth.route.js";
import books from "./src/routes/book.route.js";
import collections from "./src/routes/collection.route.js";
import listingRoutes from './src/routes/listing.route.js';
import negotiation from "./src/routes/negotiation.route.js";
import rating from "./src/routes/rating.route.js";
import users from "./src/routes/user.route.js";

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONT_URL || "http://localhost:4200",
  optionsSuccessStatus: 200
}));
app.use(express.json({limit:'1mb'}));

scheduleExpireListingsJob();

// MOUNT
app.use("/users", users);
app.use("/login", login);
app.use("/collections", collections);
app.use("/collections", books); // rotas começam com /:collectionId/books
app.use("/negotiations", negotiation);
app.use("/ratings", rating);
app.use('/listings', listingRoutes);
app.use('/articles', articleRoutes);

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));


//PASSO A PASSO
//1- criar model
//2- criar service
//3- criar controller
//4- criar route
