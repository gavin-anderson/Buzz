import { connectToDatabase } from '../../../lib/mongodb';

async function getProfileHoldings(req, res) {
    if (req.method !== 'GET') {
        console.log("HERE")
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    try {
        console.log("get-profile-holdings")
        const { db } = await connectToDatabase();
        const tokenIds = req.query.tokenIds;  // Assume tokenIds are passed as a comma-separated string
        console.log(tokenIds);
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

        // Get user information by matching tokenId with walletAddress
        const walletAddresses = tokens.map(token => token.tokenId); // Assuming tokenId maps directly to walletAddress
        const users = await db.collection('users')
                              .find({ walletAddress: { $in: walletAddresses } })
                              .project({ walletAddress: 1, username: 1 })
                              .toArray();

        // Map usernames to tokens
        const tokensWithUsernames = tokens.map(token => ({
            ...token,
            username: users.find(user => user.walletAddress === token.tokenId)?.username || 'Unknown'
        }));
        res.status(200).json(tokensWithUsernames);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export default getProfileHoldings;
