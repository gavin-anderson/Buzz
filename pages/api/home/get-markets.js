import { connectToDatabase } from '../../../lib/mongodb';

async function getMarkets(req, res) {
    if (!req.query.userAddress) {
        return res.status(400).json({ message: "User address is required" });
    }

    try {
        console.log("get-market");
        const { db } = await connectToDatabase();
        
        const user = await db.collection('users').findOne({ walletAddress: req.query.userAddress });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure tokensOwned is an array before mapping over it
        const tokenAddresses = user.tokensOwned ? user.tokensOwned.map(token => token.tokenId).filter(tokenId => tokenId !== null) : [];

        const markets = await db.collection('markets').find({ isSettled: false }).toArray();
        const users = await db.collection('users').find({}).toArray();

        if (!markets.length) {
            return res.status(200).json([]);
        }

        const usersMap = users.reduce((acc, curr) => {
            acc[curr.walletAddress] = curr;
            return acc;
        }, {});

        const result = markets.map(market => {
            const creatorUser = usersMap[market.creatorAddress];
            const isTokenOwned = tokenAddresses.includes(market.creatorAddress);

            // Ensure comments is an array before mapping over it
            const marketComments = market.comments ? market.comments.map(comment => ({
                ...comment,
                user: usersMap[comment.userId] || null
            })) : [];

            return {
                username: creatorUser ? creatorUser.username : 'Unknown',
                creatorAddress: market.creatorAddress,
                marketAddress: market.marketAddress,
                tokenName: market.tokenName,
                postMessage: market.postMessage,
                option1: market.options[0].A,
                option2: market.options[0].B,
                totalComments: market.totalComments,
                totalVolume: market.totalVolume,
                totalBettors: market.totalBettors,
                postedAgo: calculateTimeAgo(market.createdAt),
                isTokenOwned,
                comments: marketComments
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error accessing database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

function calculateTimeAgo(createdAt) {
    const timeNow = new Date();
    const timePosted = new Date(createdAt);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const elapsed = timeNow - timePosted;

    if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }
}

export default getMarkets;
