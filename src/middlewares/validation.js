import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateUser = [
    body("name")
        .trim()
        .notEmpty().withMessage("Nome é obrigatório")
        .isLength({ min: 3 }).withMessage("O nome deve ter pelo menos 3 caracteres"),

    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const existingUser = await prisma.user.findFirst({
            where: { name: req.body.name }
        });

        if (existingUser) {
            return res.status(400).json({ error: "Nome ja está em uso" })
        }

        next()
    }
]