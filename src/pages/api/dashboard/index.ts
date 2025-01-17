import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { professorId } = req.query;

  if (!professorId) {
    return res.status(400).json({ success: false, message: 'Professor ID is required' });
  }

  try {
    const divisions = await prisma.division.findMany({
      where: {
        professors: {
          some: {
            professorId: Number(professorId),
          },
        },
      },
      include: {
        students: true,
      },
    });

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const divisionData = await Promise.all(
      divisions.map(async (division: { id: number; name: string; students: { id: number; name: string; rollNumber: number; divisionId: number; }[] }) => {
      const attendanceTaken = await prisma.attendance.findFirst({
        where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        student: {
          divisionId: division.id,
        },
        },
      });

        return {
          id: division.id,
          name: division.name,
          studentCount: division.students.length,
          attendanceTaken: !!attendanceTaken,
        };
      })
    );

    res.status(200).json({ success: true, divisions: divisionData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard data', error: error });
  }
}