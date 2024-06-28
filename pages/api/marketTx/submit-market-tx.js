import { connectToDatabase } from '../../../lib/mongodb';
import { marketTransactionSchema } from '../../../schemas/marketTxSchema';
import { tokenTxSchema } from '../../../schemas/tokenTxSchema';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Validate the request body
    const { error, value } = marketTransactionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { db, client } = await connectToDatabase();
    const session = client.startSession();

    try {
        session.startTransaction();

        // Insert the market transaction
        const result = await db.collection('marketTxs').insertOne(value, { session });

        // Update the user's balance
        await db.collection('users').updateOne(
            { walletAddress: value.traderId, 'tokensOwned.tokenId': value.creatorId },
            { $inc: { 'tokensOwned.$.amount': -value.tokensAmount } },
            { session }
        );

        // Update the token holders for the trader
        const tokenUpdateResult = await db.collection('tokens').updateOne(
            { tokenId: value.creatorId, 'tokenHolders.userId': value.traderId },
            { $inc: { 'tokenHolders.$.amount': -value.tokensAmount } },
            { session }
        );

        // If the traderId is not already in tokenHolders, add it
        if (tokenUpdateResult.matchedCount === 0) {
            await db.collection('tokens').updateOne(
                { tokenId: value.creatorId },
                { $addToSet: { tokenHolders: { userId: value.traderId, amount: -value.tokensAmount } } },
                { session }
            );
        }

        // Increase the balance of the marketId
        const marketUpdateResult = await db.collection('tokens').updateOne(
            { tokenId: value.creatorId, 'tokenHolders.userId': value.marketId },
            { $inc: { 'tokenHolders.$.amount': value.tokensAmount } },
            { session }
        );

        // If the marketId is not already in tokenHolders, add it
        if (marketUpdateResult.matchedCount === 0) {
            await db.collection('tokens').updateOne(
                { tokenId: value.creatorId },
                { $addToSet: { tokenHolders: { userId: value.marketId, amount: value.tokensAmount } } },
                { session }
            );
        }

        // Fetch the last recorded values for the tokenId
        const lastTokenTx = await db.collection('tokenTxs').findOne(
            { tokenId: value.creatorId },
            { sort: { _id: -1 } }
        );

        // Create a new token transaction
        const newTokenTx = {
            tokenId: value.creatorId,
            traderId: value.traderId,
            transactionHash: "transaction-hash",
            buySell: null,
            amountIn: value.tokensAmount,
            amountOut: 0,
            priceBefore: lastTokenTx?.priceBefore || 0,
            priceAfter: lastTokenTx?.priceAfter || 0,
            curveConstantBefore: lastTokenTx?.curveConstantBefore || 0,
            curveConstantAfter: lastTokenTx?.curveConstantAfter || 0,
            userFees: 0,
            protocolFees: 0,
            isTransfer: true,
            transferTo: value.marketId,
            transferFrom: value.traderId,
        };

        // Validate the new token transaction
        const { error: tokenTxError } = tokenTxSchema.validate(newTokenTx);
        if (tokenTxError) {
            throw new Error(tokenTxError.details[0].message);
        }

        // Insert the new token transaction
        await db.collection('tokenTxs').insertOne(newTokenTx, { session });

        // Update bettors in the market if isMint is true
        if (value.isMint) {
            const market = await db.collection('markets').findOne(
                { marketAddress: value.marketId, 'bettors.bettor': value.traderId },
                { session }
            );

            if (market) {
                await db.collection('markets').updateOne(
                    { marketAddress: value.marketId, 'bettors.bettor': value.traderId },
                    {
                        $inc: {
                            'bettors.$[elem].yesHeld': value.yesAmount,
                            'bettors.$[elem].noHeld': value.noAmount,
                            'bettors.$[elem].amountBet': value.tokensAmount,
                        },
                    },
                    {
                        arrayFilters: [{ 'elem.bettor': value.traderId }],
                        session
                    }
                );
            } else {
                await db.collection('markets').updateOne(
                    { marketAddress: value.marketId },
                    {
                        $addToSet: { bettors: { bettor: value.traderId, amountBet: value.tokensAmount, yesHeld: value.yesAmount, noHeld: value.noAmount } },
                        $inc: { totalBettors: 1 }
                    },
                    { session }
                );
            }

            // Update the totalVolume of the market
            await db.collection('markets').updateOne(
                { marketAddress: value.marketId },
                { $inc: { totalVolume: value.tokensAmount } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: 'Transaction saved successfully', result });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}
