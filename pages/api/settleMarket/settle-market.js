import { connectToDatabase } from '../../../lib/mongodb';
import Joi from 'joi';

// Define the schema for validating the request body
const settleMarketSchema = Joi.object({
  creatorAddress: Joi.string().required(),
  marketAddress: Joi.string().required(),
  settledAt: Joi.date().required(),
  reportedValue: Joi.string().required(),
  isReportedValue: Joi.boolean().required(),
  settleMessage: Joi.string().required(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  // Validate the request body
  const { error, value } = settleMarketSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { creatorAddress, marketAddress, settledAt, reportedValue, isReportedValue, settleMessage } = value;
  console.log("settle-market")
  const { db, client } = await connectToDatabase();
  const session = client.startSession();

  try {
    await session.startTransaction();

    // Find and update the market
    const market = await db.collection('markets').findOne({ creatorAddress, marketAddress }, { session });
    if (!market) {
      throw new Error('Market not found');
    }

    await db.collection('markets').updateOne(
      { creatorAddress, marketAddress },
      {
        $set: {
          settledAt,
          reportedValue,
          isReportedValue,
          settleMessage,
          isSettled: true,
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: 'Market settled successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
}
