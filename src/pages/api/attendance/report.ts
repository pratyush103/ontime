import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { startDate, endDate, divisionId } = req.query;

  if (!startDate || !divisionId) {
    return res.status(400).json({ error: 'Month and divisionId are required' });
  }


  try {
    const attendanceSummary = await prisma.attendance.groupBy({
      by: ['studentId'],
      where: {
        date: {
          gte: new Date(startDate as string),
          lt: new Date(endDate as string),
        },
        student: {
          divisionId: Number(divisionId),
        },
      },
      _count: {
        status: true,
      },
    });

    const summary = await Promise.all(
      attendanceSummary.map(async (record) => {
        const student = await prisma.student.findUnique({
          where: { id: record.studentId },
          select: { name: true },
        });

        const presentCount = await prisma.attendance.count({
          where: {
            studentId: record.studentId,
            date: {
              gte: new Date(startDate as string),
              lt: new Date(endDate as string),
            },
            status: 'Present',
          },
        });

        const absentCount = await prisma.attendance.count({
          where: {
            studentId: record.studentId,
            date: {
              gte: new Date(startDate as string),
              lt: new Date(endDate as string),
            },
            status: 'Absent',
          },
        });

        return {
          studentName: student?.name,
          present: presentCount,
          absent: absentCount,
        };
      })
    );

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}