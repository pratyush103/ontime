import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { divisionId } = req.query;

  if (!divisionId) {
    return res.status(400).json({ success: false, message: 'divisionId is required' });
  }

  try {
    const division = await prisma.division.findUnique({
      where: { id: Number(divisionId) },
      include: {
        students: true,
        professors: {
          include: {
            professor: true,
          },
        },
      },
    });

    if (!division) {
      return res.status(404).json({ success: false, message: 'Division not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        date: today,
        student: {
          divisionId: Number(divisionId),
        },
      },
    });

    const avgAttendance = attendanceRecords.length / division.students.length;

    res.status(200).json({
      success: true,
      division: {
        ...division,
        avgAttendance,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching division details', error: error });
  }
}