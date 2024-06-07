import express      from "express";
import dotenv       from "dotenv";
import connectDB    from "./src/database/db.js";

//IMPORT DE ROUTES
import user from "./src/routes/user.route.js";
import login from "./src/routes/auth.route.js";

//EXECUTANDO DOTENV
dotenv.config();

//VARIAVEIS
const PORT = 3001; 
const app  = express();

//CONECTANDO COM BANCO
////connectDB();

app.use(express.json());
app.use("/user", user);
app.use("/login", login);

app.listen(PORT, ()=> console.log(`server runnig on PORT ${PORT}`));

//PASSO A PASSO
//1- criar model
//2- criar service
//3- criar controller
//4- criar route
