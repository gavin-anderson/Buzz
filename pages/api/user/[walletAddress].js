import { connectToDatabase } from '../../../lib/mongodb';
export default async function handler(req, res) {
    const { query: { walletAddress } } = req;
    console.log("Wallet Address Received:", walletAddress); // Log to see the input

    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    try {
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ walletAddress: walletAddress });
        console.log("User Found:", user); // Check what is being returned from the database

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error accessing database:", error); // More detailed error logging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
