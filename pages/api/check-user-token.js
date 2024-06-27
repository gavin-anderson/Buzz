// pages/api/check-user-token.js

import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  const { privy_id, walletAddress } = req.query;

  if (!privy_id || !walletAddress) {
    return res.status(400).json({ error: 'Missing privy_id or walletAddress' });
  }

  try {
    const { db } = await connectToDatabase();
    const userCollection = db.collection('users');
    const tokenCollection = db.collection('tokens');

    const user = await userCollection.findOne({ privy_id });
    const token = await tokenCollection.findOne({ tokenId: walletAddress });

    res.status(200).json({
      userExists: !!user,
      tokenExists: !!token,
    });
  } catch (error) {
    console.error('Error checking user and token existence:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
