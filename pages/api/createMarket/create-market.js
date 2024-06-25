import { connectToDatabase } from '../../../lib/mongodb';
import { marketSchema } from '../../../schemas/marketSchema';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { error, value } = marketSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  console.log("create-market")
  const { db } = await connectToDatabase();
  const collection = db.collection('markets');

  try {
    const result = await collection.insertOne(value);
    if (!result.insertedId) {
      throw new Error('Failed to create market');
    }

    const marketCreated = await collection.findOne({ _id: result.insertedId });
    res.status(201).json(marketCreated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
