import jwtoken  from "jsonwebtoken";
import User     from "../models/User.js";

function login(email) {
    User.findOne({email: email, status: "ativo"}).select("+password");
}

function generateToken(id) {
    jwtoken.sign({id: id}, process.env.SECRET_JWT, {expiresIn:86400});
}

export default {
    login,
    generateToken
};
