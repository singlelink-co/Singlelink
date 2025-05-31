import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../../../lib/db'; // Adjust path as necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10); // Salt rounds: 10

    const newUser = await createUser(name || null, email, hashedPassword);

    if (newUser) {
      // Do NOT return the password hash
      const { ...userWithoutPassword } = newUser;
      return res.status(201).json({ message: 'User created successfully.', user: userWithoutPassword });
    } else {
      return res.status(500).json({ message: 'Failed to create user.' });
    }

  } catch (error: any) {
    console.error('Registration error:', error);
    // Check if it's a duplicate email error from createUser
    if (error.message.includes('User with this email already exists')) {
        return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
}
