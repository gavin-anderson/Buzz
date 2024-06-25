import { connectToDatabase } from '../../../lib/mongodb';

async function getUserCreatedMarkets(req, res) {
    if (!req.query.userAddress) {
        return res.status(400).json({ message: "User address is required" });
    }

    try {
        console.log("get-user-created-markets")
        const { db } = await connectToDatabase();
        
        const markets = await db.collection('markets').find({
            creatorAddress: req.query.userAddress
        }).toArray();

        const now = new Date();
        markets.sort((a, b) => {
            const aExpiry = new Date(a.expiryDate);
            const bExpiry = new Date(b.expiryDate);

            if (a.isSettled && b.isSettled) {
                return new Date(a.settledAt) - new Date(b.settledAt); // Oldest settled at back
            } else if (a.isSettled) {
                return 1; // a goes to the back
            } else if (b.isSettled) {
                return -1; // b goes to the back
            } else if (!a.expiryDate && b.expiryDate && bExpiry.getTime() > now.getTime() + 7 * 24 * 60 * 60 * 1000) {
                return -1; // a (no expiry) before b (expiry > 1 week)
            } else if (!b.expiryDate && a.expiryDate && aExpiry.getTime() > now.getTime() + 7 * 24 * 60 * 60 * 1000) {
                return 1; // b (no expiry) before a (expiry > 1 week)
            } else if (aExpiry < now && bExpiry < now) {
                return bExpiry - aExpiry; // Most past expiry at front
            } else {
                return aExpiry - bExpiry; // Nearest expiry at front
            }
        });

        const result = markets.map(market => ({
            marketAddress: market.marketAddress,
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
