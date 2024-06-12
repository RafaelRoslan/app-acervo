import dotenv from "dotenv";
import jwtoken from "jsonwebtoken";
import service from "../services/user.service.js";

dotenv.config();

function authenticate(req, res, next) {
    try {
        //RECEBE AUTHORIZATION E CHECA SE ESTA VAZIO
        const {authorization} = req.headers;
        if(!authorization){
            return res.status(401).send({ message: "Autorização não encontrada" });;
        }

        //DIVIDE AUTHORIZATION E CHECA QUANTIDADE
        const path = authorization.split(" ");
        if (path.length !== 2) {
            return res.status(401).send({ message: "Formato do token inválido" });
        }

        //DESESTRUTURA PATH EM CONSTANTES E CHECA SCHEMA
        const [schema, token] = path;
        if(schema !== "Bearer"){
            return res.status(401).send({ message: "Esquema de autorização inválido" });;
        }

        //EFETUA VERIFICACAO DE TOKEN
        jwtoken.verify(token, process.env.SECRET_JWT, async(error, decoded)=>{
            if(error){
                return res.status(401).send({menssagem: "Token invalido"});
            }

            const user = await service.getUser(decoded.id);

            if(!user){
                return res.status(401).send({menssagem: "Token invalido"})
            }

            req.userId = user._id;
            return next();
        });

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export default authenticate;