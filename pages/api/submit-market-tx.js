import { connectToDatabase } from '../../lib/mongodb';
import { marketTransactionSchema } from '../../schemas/marketTxSchema';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { error, value } = marketTransactionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  console.log("submit-market-tx")
  const { db, client } = await connectToDatabase();
  const session = client.startSession();

  try {
    await session.startTransaction();
    const transactionsCollection = db.collection('marketTransactions');
    const marketsCollection = db.collection('markets');

    const result = await transactionsCollection.insertOne(value, { session });
    if (!result.insertedId) throw new Error('Failed to create Market Transaction');

    const updateResult = await marketsCollection.updateOne(
      { marketId: value.marketId },
      {
        $inc: { totalVolume: value.amountIn, totalBettors: 1 }
      },
      { session }
    );

    if (updateResult.modifiedCount !== 1) throw new Error('Market not found');

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(value);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
}
