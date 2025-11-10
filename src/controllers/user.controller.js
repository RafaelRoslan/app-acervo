import User from "../models/User.js";
import service from "../services/user.service.js";

async function createUser(req, res) {
  try {
    const { name, lastname, email, password, type } = req.body;

    if (!name || !lastname || !email || !password || !type) {
      return res.status(400).send({ message: "Preencha todos os campos obrigatórios." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).send({ message: "E-mail já cadastrado." });
    }

    const user = await service.createUser(req.body);

    const userRes = {
      id: user._id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      type: user.type,
      createdAt: user.createdAt
    };

    res.status(201).send({ message: "Usuário cadastrado com sucesso.", user: userRes });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).send({ message: error.message });
  }
}


async function readUser(req, res) {
    try {
         //ATRIBUINDO REQ EM VARIAVEL
         const {id} = req.params;

         //SOLICITANDO AO SERVICE O RECEBIMENTO DO USUARIO
         const user = await service.getUser(id);
         if(!user){
            return res.status(400).send({message: "Usuario não encontrado"});
         }
 
         //RETORNANDO SUCESSO COM MENSAGEM
         res.status(200).send({user});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

// async function readCurrentUser(req, res) {

//     const user = await service.getUser(req.userId);
//     if (!user) return res.status(404).send({ message: "Usuário não encontrado." });

//     res.status(200).send({ message: "Usuário encontrado com sucesso.", user });
// }

async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const updates = req.body;

    const user = await service.getUser(id);
    if (!user) return res.status(404).send({ message: "Usuário não encontrado." });

    if (String(user._id) !== req.userId) {
      return res.status(403).send({ message: "Você não pode atualizar outro usuário." });
    }

    const updated = await service.updateUser(id, updates);
    res.status(200).send({ message: "Usuário atualizado com sucesso.", user: updated });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}


async function deleteUser(req, res) {
    try {
        //ATRIBUINDO REQ EM VARIAVEL
        const id = req.params.id;

        //SOLICITANDO AO SERVICE O RECEBIMENTO DO USUARIO
        const user = await service.getUser(id);

        if(!user){
            return res.status(400).send({message: "Usuario não encontrado"});
         }
        if(String(user._id) != req.userId){
            return res.status(400).send({menssagem: "Voce não pode deletar outro usuario"});
        }

        //SOLICITANDO AO SERVICE O RECEBIMENTO DO USUARIO
        await service.deleteUser(id);

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({message: "Cliente deletado com sucesso"});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function readMe(req, res) {
  try {
    const id = req.userId; // vem do auth.middleware

    const user = await service.getUser(id);
    if (!user) {
      return res.status(400).send({ message: "Usuario não encontrado" });
    }

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

async function updateMe(req, res) {
  try {
    const id = req.userId;

    const existing = await service.getUser(id);
    if (!existing) {
      return res.status(400).send({ message: "Usuario não encontrado" });
    }

    const { name, lastname, type, address, bankDetails, pix, status } = req.body;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (lastname !== undefined) updates.lastname = lastname;
    if (type !== undefined) updates.type = type;       // se você adicionou no schema
    if (status !== undefined) updates.status = status; // se quiser permitir trocar

    if (address !== undefined) updates.address = address;
    if (bankDetails !== undefined) updates.bankDetails = bankDetails;
    if (pix !== undefined) updates.pix = pix;

    const updated = await service.updateUser(id, updates);

    return res.status(200).send({
      message: "Perfil atualizado com sucesso",
      user: updated,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

export default {
    createUser,
    readUser,
    //readCurrentUser,
    updateUser,
    deleteUser,
    readMe,
    updateMe
}