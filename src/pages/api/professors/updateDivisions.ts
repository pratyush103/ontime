import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { professorId, divisionIds } = req.body;

    if (!professorId || !Array.isArray(divisionIds)) {
      return res.status(400).json({ success: false, message: 'Invalid request data' });
    }

    try {
      await prisma.professor.update({
        where: { id: professorId },
        data: {
            divisions: {
                create: divisionIds.map((divisionId: number) => ({
                  division: {
                    connect: { id: divisionId },
                  },
                })),
              },
        },
      });
      res.status(200).json({ success: true, message: 'Divisions updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating divisions', error: error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
