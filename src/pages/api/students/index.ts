import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, divisionId, rollNumber } = req.body;

    if (!name || !divisionId) {
      return res.status(400).json({ success: false, message: 'Name and divisionId are required' });
    }

    try {
      const newStudent = await prisma.student.create({
        data: {
          name,
          rollNumber: Number(rollNumber),
          divisionId: Number(divisionId),

        },
      });
      res.status(201).json({ success: true, message: 'Student added successfully', student: newStudent });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error adding student'+ error });
    }
  } else if (req.method === 'GET') {
    const { divisionId } = req.query;

    if (!divisionId) {
      return res.status(400).json({ success: false, message: 'divisionId is required' });
    }

    try {
      const students = await prisma.student.findMany({
        where: { divisionId: Number(divisionId) },
      });
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching students' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}