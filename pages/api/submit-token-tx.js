import { connectToDatabase } from '../../lib/mongodb';
import { tokenTransactionSchema } from '../../schemas/tokenTransactionSchema'; // Assuming the schema validation is already set up

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { error, value } = tokenTransactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { db, client } = await connectToDatabase();
  const session = client.startSession();

  try {
    await session.startTransaction();
    // Checking if the token exists
    const token = await db.collection('tokens').findOne({ creatorId: value.creatorId }, { session });

    if (!token) {
      // Create new token if it doesn't exist
      const newTokenData = {
        userId: value.creatorId,
        totalSupply: value.amountOut,
        tokenHolders: [{ userId: value.creatorId, amount: value.amountOut }],
        // Add other fields from tokenTx as needed
      };
      const insertedToken = await db.collection('tokens').insertOne(newTokenData, { session });
      if (!insertedToken.insertedId) {
        throw new Error('Failed to create new token');
      }
    } else {
      // Update existing token
      const updateToken = await db.collection('tokens').updateOne(
        { creatorId: value.creatorId },
        {
          $inc: { totalSupply: value.amountOut },
          $push: { tokenHolders: { userId: value.traderId, amount: value.amountOut } },
        },
        { session }
      );
      if (!updateToken.modifiedCount) {
        throw new Error('Failed to update token');
      }
    }

    // Save the token transaction
    const tokenTxResult = await db.collection('tokenTxs').insertOne(value, { session });
    if (!tokenTxResult.insertedId) {
      throw new Error('Failed to save token transaction');
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(value);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
}
