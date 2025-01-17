import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { studentId } = req.query;
  const { startDate, endDate } = req.body;

  if (!studentId || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'studentId, startDate, and endDate are required' });
  }

  try {
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId: Number(studentId),
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.status(200).json({ success: true, attendance: attendanceRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendance records', error: error });
  }
}