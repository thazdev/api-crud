import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" })
    }
};



//CRIANDO O USUARIO
export const createUser = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Nome é obrigatório" });
    }
    try {
        const user = await prisma.user.create({
            data: { name }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar um usuário" });
    }
};



//DELETANDO O USUARIO
export const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await prisma.user.findUnique({
            where: { id }
        })
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }
        await prisma.user.delete({
            where: { id }
        });
        res.status(200).json({ message: `Usuário com ID ${id} removido com sucesso!` })
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" })
    }
}



//ATUALIZANDO O USUARIO
export const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        //verifica se o nome foi enviado
        if (!name) {
            return res.status(400).json({ error: "Nome é obrigatório" })
        }
        //verifica se o usuario existe no banco
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }
        //atualiza o usuario no banco de dados
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name }
        });
        //retorna o usuario atualizado
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" })
    }
}



export const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        })
        if (existingUser) {
            return res.status(400).json({ error: "Email já cadastrado" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword)
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar um usuário" });
    }
}



export const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        })
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciais inválidas" })
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        res.json({ token })
    } catch (error) {
        res.status(500).json({ error: "Erro ao fazer login" })
    }
}