import dotenv from "dotenv";
import jwtoken from "jsonwebtoken";
import service from "../services/user.service.js";

dotenv.config();

function authenticate(req, res, next) {
    try {
        // Verifica se o cabeçalho de autorização foi fornecido
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).send({ message: "Cabeçalho de autorização não encontrado." });
        }

        // Divide o cabeçalho em esquema e token
        const parts = authorization.split(" ");
        if (parts.length !== 2) {
            return res.status(401).send({ message: "Formato do token inválido." });
        }

        const [schema, token] = parts;

        // Verifica se o esquema de autenticação é válido
        if (schema !== "Bearer") {
            return res.status(401).send({ message: "Esquema de autorização inválido." });
        }

        // Valida o token JWT
        jwtoken.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
            if (error) {
                return res.status(401).send({ message: "Token inválido." });
            }

            // Verifica se o usuário associado ao token existe
            const user = await service.getUser(decoded.id);
            if (!user || !user._id) {
                return res.status(401).send({ message: "Usuário não encontrado ou token inválido." });
            }

            // Anexa informações do usuário à requisição
            req.userId = user._id;
            return next();
        });
    } catch (error) {
        // Retorna erro genérico caso ocorra um problema interno
        return res.status(500).send({ message: error.message });
    }
}

export default authenticate;
