import { connectToDatabase } from '../../lib/mongodb';
import Joi from 'joi';

// Define the schema to validate the incoming request
const createTokenSchema = Joi.object({
  tokenId: Joi.string().required(),
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Validate the request body against the createTokenSchema
      const { error, value } = createTokenSchema.validate(req.body);
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

      // Set initial values for the token
      const tokenData = {
        tokenId,
        totalSupply: 0,
        priceETH: null,
        priceUSD: null,
        curveConstant: null,
        curveSupply: 0,
        marketSupply: 0,
        curveETH: null,
        totalTrades: 0,
        volume: 0,
        totalUserFees: 0,
        totalProtocolFees: 0,
        tokenHolders: [],
      };

      // Insert the new token into the database
      const result = await db.collection('tokens').insertOne(tokenData);

      return res.status(201).json({ message: 'Token created successfully', tokenId: result.insertedId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
