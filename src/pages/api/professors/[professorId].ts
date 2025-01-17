import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { professorId } = req.query;

  if (!professorId) {
    return res.status(400).json({ success: false, message: 'Professor ID is required' });
  }

  try {
    const professor = await prisma.professor.findUnique({
      where: { id: Number(professorId) },
      include: {
        divisions: {
          include: {
            division: true,
          },
        },
      },
    });

    if (!professor) {
      return res.status(404).json({ success: false, message: 'Professor not found' });
    }

    res.status(200).json({ success: true, professor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching professor details', error: error});
  }
}