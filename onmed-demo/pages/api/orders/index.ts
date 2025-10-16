import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const { name, address, description, price } = req.body;
      if (!name || !address || price == null) {
        return res.status(400).json({ error: 'name, address and price are required' });
      }
      const order = await prisma.order.create({
        data: {
          name,
          address,
          description,
          price: Number(price),
        },
      });
      return res.status(201).json(order);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
