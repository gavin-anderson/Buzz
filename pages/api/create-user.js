import { connectToDatabase } from '../../lib/mongodb';
import { userSchema } from '../../schemas/userSchema';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  console.log("create-user")
  const { db } = await connectToDatabase();
  const collection = db.collection('users');

  try {
    // Check if the user already exists
    const existingUser = await collection.findOne({
      $or: [
        { privy_id: value.privy_id },
        { walletAddress: value.walletAddress }
      ]
    });

    if (existingUser) {
      // User already exists, no need to create a new one
      return res.status(200).json({ message: 'User already exists. No action taken.' });
    }

    const result = await collection.insertOne(value);
    if (!result.insertedId) {
      throw new Error('Failed to create user.');
    }

    const newUser = await collection.findOne({ _id: result.insertedId });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
