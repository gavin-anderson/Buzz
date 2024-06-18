// Import necessary functions and schema
import { connectToDatabase } from '../../lib/mongodb';

async function getMarkets(req, res) {
    if (!req.query.userAddress) {
        return res.status(400).json({ message: "User address is required" });
    }

    try {
        const { db } = await connectToDatabase();
        // First, find the user by wallet address to get their tokensOwned
        const user = await db.collection('users').findOne({ walletAddress: req.query.userAddress });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract tokenIds that the user owns
        const tokenIds = user.tokensOwned.map(token => Object.keys(token)[0]).filter(tokenId => tokenId !== null);
        // Now, query the markets where creatorAddress is in user's tokenIds and isSettled is false
        const markets = await db.collection('markets').find({
            creatorAddress: { $in: tokenIds },
            isSettled: false
        }).toArray();
        // Map the data to fit the MarketsData interface
        const result = markets.map(market => ({
            username: user.username, // Assuming username is same for all markets
            postMessage: market.postMessage,
            option1: market.options[0].A, // Assuming there's always two options
            option2: market.options[0].B,
            totalComments: market.totalComments,
            totalVolume: market.totalVolume,
            totalBettors: market.totalBettors,
            postedAgo: calculateTimeAgo(market.createdAt)
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error accessing database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Helper function to calculate time ago from createdAt
function calculateTimeAgo(createdAt) {
    const timeNow = new Date();
    const timePosted = new Date(createdAt);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const elapsed = timeNow - timePosted;

    if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    } else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    } else {
         return Math.round(elapsed/msPerDay) + ' days ago';   
    }
}

export default getMarkets;
