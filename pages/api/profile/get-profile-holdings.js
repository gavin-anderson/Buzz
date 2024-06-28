import { connectToDatabase } from '../../../lib/mongodb';

async function getProfileHoldings(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    try {
        console.log("get-profile-holdings")
        const { db } = await connectToDatabase();
        const tokenIds = req.query.tokenIds;  // Assume tokenIds are passed as a comma-separated string
        if (!tokenIds) {
            res.status(400).json({ message: 'No tokenIds provided' });
            return;
        }

        // Convert tokenIds string to an array
        const tokenIdArray = tokenIds.split(',');

        // Fetch tokens based on tokenIds
        const tokens = await db.collection('tokens')
                               .find({ tokenId: { $in: tokenIdArray } })
                               .project({ tokenId: 1, priceETH: 1, priceUSD: 1, volume: 1 })
                               .toArray();

        // Get user information by matching tokenId with tokensOwned.tokenId
        const users = await db.collection('users')
                              .find({ 'tokensOwned.tokenId': { $in: tokenIdArray } })
                              .project({ walletAddress: 1, username: 1, tokensOwned: 1 })
                              .toArray();

        // Map usernames to tokens
        const tokensWithUsernames = tokens.map(token => {
            const user = users.find(user => user.tokensOwned.some(t => t.tokenId === token.tokenId));
            return {
                ...token,
                username: user ? user.username : 'Unknown',
                amount: user ? user.tokensOwned.find(t => t.tokenId === token.tokenId).amount : 0
            };
        });
        res.status(200).json(tokensWithUsernames);
    } catch (error) {
        res.status500().json({ message: 'Internal Server Error', error: error.message });
    }
}

export default getProfileHoldings;
