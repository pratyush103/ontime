import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password, name, department, isHOD, divisionIds } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const existingProfessor = await prisma.professor.findUnique({
      where: { username },
    });

    if (existingProfessor) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProfessor = await prisma.professor.create({
      data: {
        username,
        password: hashedPassword,
        name: name,
        department,
        isHOD,
        divisions: {
          create: divisionIds.map((divisionId: number) => ({
            division: {
              connect: { id: divisionId },
            },
          })),
        },
      },
    });

    return res.status(201).json({ success: true, message: 'Professor registered successfully', professor: newProfessor });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}