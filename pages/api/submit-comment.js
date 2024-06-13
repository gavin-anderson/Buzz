import { connectToDatabase } from '../../lib/mongodb';
import { commentSchema } from '../../schemas/commentSchema'; // Assuming the schema validation is already set up

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { error, value } = commentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { db, client } = await connectToDatabase();
  const session = client.startSession();

  try {
    await session.startTransaction();
    // Updating the market to include the new comment and increment the comment count
    const updateResult = await db.collection('markets').updateOne(
      { marketId: value.marketId },
      {
        $push: { comments: value },
        $inc: { totalComments: 1 }
      },
      { session }
    );

    if (updateResult.modifiedCount === 1) {
      // Saving the comment in a separate 'comments' collection
      const commentResult = await db.collection('comments').insertOne(value, { session });
      if (commentResult.insertedId) {
        value.commentId = commentResult.insertedId.toString(); // Set the commentId to the inserted document's ID
        await session.commitTransaction();
        session.endSession();
        res.status(201).json(value); // Returning the comment with its ID
      } else {
        throw new Error('Failed to save comment');
      }
    } else {
      throw new Error('Market not found');
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(404).json({ error: err.message });
  }
}
