import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const orderId = Number(id);
    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) return res.status(404).json({ error: 'Order not found' });
    if (existing.status === 'ACCEPTED') {
      return res.status(400).json({ error: 'Order already accepted' });
    }
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'ACCEPTED' },
    });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
