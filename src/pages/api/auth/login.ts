import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const professor = await prisma.professor.findUnique({
    where: { username },
  });

  if (!professor || !(await bcrypt.compare(password, professor.password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: 'JWT secret is not defined' });
  }

  const token = jwt.sign({ id: professor.id, username: professor.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return res.status(200).json({ success: true, message: 'Login successful', token, id: professor.id });
}