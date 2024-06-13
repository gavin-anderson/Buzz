// Assuming you have a `mongodb.js` for DB connection, import it here:
import { connectToDatabase } from '../../lib/mongodb';

// Define the function to fetch all users with their market data using MongoDB aggregation
async function allUsersWithMarketData() {
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
        let: { userWallet: "$walletAddress" },
        pipeline: [
          { $unwind: "$tokenHolders" },
          {
            $match: {
              $expr: {
                $eq: ["$tokenHolders.userId", "$$userWallet"]
              }
            }
          }
        ],
        as: "tokensHeld"
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
        tokenHolders: {
          $reduce: {
            input: "$tokensHeld",
            initialValue: { total: 0, count: 0 },
            in: {
              total: { $add: ["$$value.total", "$$this.tokenHolders.amount"] },
              count: { $add: ["$$value.count", 1] }
            }
          }
        }
      }
    }
  ]).toArray();
  return users;
}

// Define the function to format user data for response
function formatUserData(user) {
  return {
    username: user.username || "0",
    profileName: user.profileName || "0",
    tokenPrice: formatTokenPrice(user.tokensOwned),
    holders: user.tokenHolders.count || 0,
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

function formatTokenPrice(tokensOwned) {
  if (tokensOwned && tokensOwned.length > 0) {
    const firstToken = tokensOwned[0];
    return firstToken.amount ? `${firstToken.amount}` : "0";
  }
  return "0";
}

// API handler for Next.js API route
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
