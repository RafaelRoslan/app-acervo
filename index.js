//IMPORTS
import express from 'express';



const PORT = 3001; 
const app  = express();


app.use(express.json());

app.listen(PORT, ()=> console.log(`server runnig on PORT ${PORT}`));
