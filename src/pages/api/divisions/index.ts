import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    try {
      const newDivision = await prisma.division.create({
        data: {
          name,
        },
      });
      res.status(201).json({ success: true, message: 'Division created successfully', division: newDivision });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating division', error: error });
    }
  } else if (req.method === 'GET') {
    const { id } = req.query;

    try {
      if (id) {
        const division = await prisma.division.findUnique({
          where: { id: Number(id) },
          include: { students: true },
        });
        if (!division) {
          return res.status(404).json({ success: false, message: 'Division not found' });
        }
        res.status(200).json({ success: true, division });
      } 
      
      else {
        const divisions = await prisma.division.findMany({
          include: { students: true },
        });
        res.status(200).json({ success: true, divisions });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching divisions', error: error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}