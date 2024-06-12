import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/database/db.js";

//IMPORT DE ROUTES
import login from "./src/routes/auth.route.js";
import books from "./src/routes/book.route.js";
import collections from "./src/routes/collection.route.js";
import users from "./src/routes/user.route.js";


//EXECUTANDO DOTENV
dotenv.config();

//VARIAVEIS
const PORT = 3001; 
const app  = express();



//CONECTANDO COM BANCO
connectDB();
app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}))

app.use(express.json());
app.use("/users", users);
app.use("/login", login);
app.use("/collections", collections);
app.use("/collections", books);

app.listen(PORT, ()=> console.log(`server runnig on PORT ${PORT}`));

//PASSO A PASSO
//1- criar model
//2- criar service
//3- criar controller
//4- criar route
