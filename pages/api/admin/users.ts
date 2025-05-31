import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // Adjust path as necessary
import { getAllUsers } from '../../../lib/db'; // Adjust path as necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await unstable_getServerSession(req, res, authOptions as any);

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Requires admin privileges.' });
  }

  try {
    const users = await getAllUsers();
    // Sanitize user data if necessary, e.g., remove password hashes if they were accidentally fetched
    // (though getAllUsers currently only selects specific fields)
    return res.status(200).json(users);
  } catch (error: any) {
    console.error('Error fetching users for admin panel:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
