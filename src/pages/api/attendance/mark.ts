import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { attendance } = req.body;

    try {
      const attendanceRecords = await Promise.all(
        attendance.map(async (record: { studentId: number; status: string }) => {
          return prisma.attendance.create({
            data: {
              studentId: record.studentId,
              date: new Date(),
              status: record.status,
            },
          });
        })
      );
      return res.status(200).json({ success: true, message: 'Attendance recorded successfully', attendanceRecords });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error recording attendance', error });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}