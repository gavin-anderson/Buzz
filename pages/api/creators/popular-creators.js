import { connectToDatabase } from '../../../lib/mongodb';

async function allUsersWithMarketData() {
  console.log("popular-creators");
  const { db } = await connectToDatabase();
  const users = await db.collection('users').aggregate([
    {
      $lookup: {
        from: "markets",
        localField: "walletAddress",
        foreignField: "creatorAddress",
        as: "marketData"
      }
    },
    {
      $lookup: {
        from: "tokens",
        localField: "walletAddress",
        foreignField: "tokenId",
        as: "tokenData"
      }
    },
    {
      $addFields: {
        totalMarkets: { $size: "$marketData" },
        liveMarkets: {
          $size: {
            $filter: {
              input: "$marketData",
              as: "market",
              cond: { $eq: ["$$market.isSettled", false] }
            }
          }
        },
        totalNonMarketHolders: { $arrayElemAt: ["$tokenData.totalNonMarketHolders", 0] },
      }
    }
  ]).toArray();
  return users;
}

function formatUserData(user) {
  return {
    username: user.username || "0",
    profileName: user.profileName || "0",
    tokenPrice: 0,
    holders: user.totalNonMarketHolders || 0,
    markets: user.totalMarkets || 0,
    liveMarkets: user.liveMarkets || 0,
    "24h": "0",
    "7d": "0",
    created: formatDate(user.createdAt)
  };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  return `${year}-${formattedMonth}-${formattedDay}`;
}

export default async function handler(req, res) {
  try {
    const users = await allUsersWithMarketData();
    const userData = users.map(user => formatUserData(user));
    res.status(200).json(userData);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
}
