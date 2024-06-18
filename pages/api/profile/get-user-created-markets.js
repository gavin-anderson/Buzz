
import { connectToDatabase } from '../../../lib/mongodb';

async function getUserCreatedMarkets(req, res) {
    if (!req.query.userAddress) {
        return res.status(400).json({ message: "User address is required" });
    }

    try {
        const { db } = await connectToDatabase();
        
        const markets = await db.collection('markets').find({
            creatorAddress: req.query.userAddress
        }).toArray();

        const result = markets.map(market => ({
            postMessage: market.postMessage,
            option1: market.options[0].A, // Assuming there's always two options
            option2: market.options[0].B,
            totalComments: market.totalComments,
            totalVolume: market.totalVolume,
            totalBettors: market.totalBettors,
            isSettled: market.isSettled,
            settledAt: market.settledAt,
            settleMessage: market.settleMessage,
            postedAgo: calculateTimeAgo(market.createdAt),
            comments: market.comments
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

export default getUserCreatedMarkets;
