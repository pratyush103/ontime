import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { studentId, date, status } = req.body;

    try {
      const attendance = await prisma.attendance.create({
        data: {
          studentId,
          date: new Date(date),
          status,
        },
      });
      return res.status(200).json({ success: true, message: 'Attendance recorded successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error recording attendance' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}