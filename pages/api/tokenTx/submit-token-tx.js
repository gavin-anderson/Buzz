import { connectToDatabase } from '../../../lib/mongodb';
import { tokenTxSchema } from '../../../schemas/tokenTxSchema';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { error, value } = tokenTxSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { db, client } = await connectToDatabase();
  const session = client.startSession();

  try {
    await session.startTransaction();

    // Get token
    const token = await db.collection('tokens').findOne({ tokenId: value.tokenId }, { session });
    if (!token) {
      throw new Error('Token not found');
    }

    // Get user
    const user = await db.collection('users').findOne({ walletAddress: value.traderId }, { session });
    if (!user) {
      throw new Error('User not found');
    }

    // Update token and user balances
    if (value.buySell) {
      // Buy
      const tokenHolderIndex = token.tokenHolders.findIndex(holder => holder.userId === value.traderId);
      let updatedTokenHolders;

      if (tokenHolderIndex > -1) {
        updatedTokenHolders = token.tokenHolders.map(holder =>
          holder.userId === value.traderId
            ? { ...holder, amount: holder.amount + value.amountOut }
            : holder
        );
      } else {
        updatedTokenHolders = [...token.tokenHolders, { userId: value.traderId, amount: value.amountOut }];
      }

      await db.collection('tokens').updateOne(
        { tokenId: value.tokenId },
        {
          $inc: { totalSupply: value.amountOut },
          $set: { tokenHolders: updatedTokenHolders },
        },
        { session }
      );

      const tokenOwnedIndex = user.tokensOwned.findIndex(tokenOwned => tokenOwned.tokenId === value.tokenId);
      let updatedTokensOwned;

      if (tokenOwnedIndex > -1) {
        updatedTokensOwned = user.tokensOwned.map(tokenOwned =>
          tokenOwned.tokenId === value.tokenId
            ? { ...tokenOwned, amount: tokenOwned.amount + value.amountOut }
            : tokenOwned
        );
      } else {
        updatedTokensOwned = [...user.tokensOwned, { tokenId: value.tokenId, amount: value.amountOut }];
      }

      await db.collection('users').updateOne(
        { walletAddress: value.traderId },
        { $set: { tokensOwned: updatedTokensOwned } },
        { session }
      );
    } else {
      // Sell
      const tokenHolderIndex = token.tokenHolders.findIndex(holder => holder.userId === value.traderId);
      let updatedTokenHolders;

      if (tokenHolderIndex > -1) {
        updatedTokenHolders = token.tokenHolders.map(holder =>
          holder.userId === value.traderId
            ? { ...holder, amount: holder.amount - value.amountOut }
            : holder
        ).filter(holder => holder.amount > 0); // Remove holders with zero amount
      } else {
        throw new Error('Token not owned by user');
      }

      await db.collection('tokens').updateOne(
        { tokenId: value.tokenId },
        {
          $inc: { totalSupply: -value.amountOut },
          $set: { tokenHolders: updatedTokenHolders },
        },
        { session }
      );

      const tokenOwnedIndex = user.tokensOwned.findIndex(tokenOwned => tokenOwned.tokenId === value.tokenId);
      let updatedTokensOwned;

      if (tokenOwnedIndex > -1) {
        updatedTokensOwned = user.tokensOwned.map(tokenOwned =>
          tokenOwned.tokenId === value.tokenId
            ? { ...tokenOwned, amount: tokenOwned.amount - value.amountOut }
            : tokenOwned
        ).filter(tokenOwned => tokenOwned.amount > 0); // Remove tokens with zero amount
      } else {
        throw new Error('Token not owned by user');
      }

      await db.collection('users').updateOne(
        { walletAddress: value.traderId },
        { $set: { tokensOwned: updatedTokensOwned } },
        { session }
      );
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
