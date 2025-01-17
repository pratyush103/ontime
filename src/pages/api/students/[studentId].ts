import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { studentId } = req.query;

  if (method === 'GET') {
    try {
      const student = await prisma.student.findUnique({
        where: { id: Number(studentId) },
        include: {
          division: true,
        },
      });
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      res.status(200).json({ success: true, student });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching student details', error: error });
    }
  } else if (method === 'DELETE') {
    try {
      await prisma.student.delete({
        where: { id: Number(studentId) },
      });
      res.status(200).json({ success: true, message: 'Student removed successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error removing student', error: error });
    }
  } else if (method === 'PUT') {
    const { name, rollNumber, divisionId } = req.body;
    if (!name || !rollNumber || !divisionId) {
      return res.status(400).json({ success: false, message: 'Name, roll number, and division ID are required' });
    }
    try {
      const updatedStudent = await prisma.student.update({
        where: { id: Number(studentId) },
        data: {
          name,
          rollNumber,
          divisionId: Number(divisionId),
        },
        include: {
          division: true,
        },
      });
      res.status(200).json({ success: true, student: updatedStudent });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating student', error: error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}