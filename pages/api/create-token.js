import { connectToDatabase } from '../../lib/mongodb';
import { tokenSchema } from '../../schemas/tokenSchema';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Validate the request body against the tokenSchema
      const { error, value } = tokenSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { tokenId } = value;

      // Connect to the database
      const { db } = await connectToDatabase();

      // Check if the token already exists
      const existingToken = await db.collection('tokens').findOne({ tokenId });
      if (existingToken) {
        return res.status(409).json({ message: 'Token already exists' });
      }

      // Insert the new token into the database
      const result = await db.collection('tokens').insertOne(value);

      return res.status(201).json({ message: 'Token created successfully', tokenId: result.insertedId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
