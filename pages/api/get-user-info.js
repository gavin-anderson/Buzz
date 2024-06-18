import { connectToDatabase } from '../../lib/mongodb';

async function getUserInfo(req, res) {
    const privyId = req.query.privyId; // Ensure this is passed in the query
    if (!privyId) {
        return res.status(400).json({ message: "Privy ID is required" });
    }

    try {
        const { db } = await connectToDatabase();

        // Retrieve user details by privy_id
        const user = await db.collection('users').findOne({ privy_id: privyId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retrieve token details where tokenId matches the user's walletAddress
        const tokenDetails = await db.collection('tokens').findOne({ tokenId: user.walletAddress });
        if (!tokenDetails) {
            return res.status(404).json({ message: "Token details not found for this user" });
        }

        // Prepare the result
        const result = {
            profileName: user.profileName,
            username: user.username,
            tokensOwned: {
                array: user.tokensOwned,
                length: user.tokensOwned.length
            },
            tokenDetails: {
                tokenSupply: tokenDetails.totalSupply,
                priceETH: tokenDetails.priceETH,
                priceUSD: tokenDetails.priceUSD,
                totalTrades: tokenDetails.totalTrades,
                curveETH: tokenDetails.curveETH,
                volume: tokenDetails.volume,
                totalUserFees: tokenDetails.totalUserFees,
                totalProtocolFees: tokenDetails.totalProtocolFees,
                tokenHolders: {
                    array: tokenDetails.tokenHolders,
                    length: tokenDetails.tokenHolders.length
                }
            }
        };
        res.status(200).json(result);
    } catch (error) {
        console.error('Error accessing database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default getUserInfo;
