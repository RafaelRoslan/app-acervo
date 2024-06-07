import service from "../services/auth.service.js";

async function login(req, res) {
    try {
        //DESESTRUTURANDO REQ EM VARIAVEIS
        const {email, password} = req.body;

        //SOLICITANDO AO SERVICE A CONSULTA DE USUARIO
        const user = await service.login(email);
        
        //VERIFICANDO SE EXISTE USUARIO
        if(!user){
            return res.status(400).send({menssagem: "Usuario não encontrado"});
        }

         //VERIFICANDO SENHA
         const senhaIsValid = bcrypt.compareSync(password, user.password);
         if(!senhaIsValid){
             return res.status(400).send({menssagem: "senha não confere"});
        }

        //GERANDO TOKEN DE ACESSO
        const token = service.generateToken(user.id);

        
    } catch (error) {
        //RETORNA ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({menssagem: error.message});
    }
}

export default login;