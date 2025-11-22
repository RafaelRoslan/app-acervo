// middlewares/admin.middleware.js
import User from "../models/User.js";

async function requireAdmin(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Não autenticado.' });
    }

    const user = await User.findById(req.userId).select('role');

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso permitido apenas para administradores.' });
    }

    next();
  } catch (err) {
    console.error('Erro em requireAdmin:', err);
    return res.status(500).json({ message: 'Erro ao verificar permissão de administrador.' });
  }
}

export default requireAdmin;
