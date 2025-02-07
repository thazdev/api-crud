import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido" })
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next()
    } catch (error) {
        res.status(403).json({ error: "Token inválido" })
    }
}