import { connectToDatabase } from '../../lib/mongodb';

async function getUserInfo(req, res) {
    const privyId = req.query.privyId; // Ensure this is passed in the query
    if (!privyId) {
        return res.status(400).json({ message: "Privy ID is required" });
    }

    try {
        console.log("get-user-info");
        const { db } = await connectToDatabase();

        // Retrieve user details by privy_id
        const user = await db.collection('users').findOne({ privy_id: privyId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Initialize the response object with user data
        const result = {
            profileName: user.profileName || 'N/A',
            username: user.username || 'N/A',
            walletAddress: user.walletAddress || "N/A",
            tokensOwned: user.tokensOwned || [], // Directly assign the tokensOwned array
            tokenDetails: null // Default token details to null if not found
        };

        // Attempt to retrieve token details
        const tokenDetails = await db.collection('tokens').findOne({ tokenId: user.walletAddress });
        if (tokenDetails) {
            result.tokenDetails = {
                tokenSupply: tokenDetails.totalSupply,
                priceETH: tokenDetails.priceETH,
                priceUSD: tokenDetails.priceUSD,
                totalTrades: tokenDetails.totalTrades,
                curveETH: tokenDetails.curveETH,
                volume: tokenDetails.volume,
                totalUserFees: tokenDetails.totalUserFees,
                totalProtocolFees: tokenDetails.totalProtocolFees,
                tokenHolders: tokenDetails.tokenHolders || []
            };
        }

        // Return the result with as much information as available
        res.status(200).json(result);
    } catch (error) {
        console.error('Error accessing database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default getUserInfo;
