import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // or your URI connection string
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 45000, 
  retryWrites: true
});

let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    await client.connect();
    isConnected = true; // Set this flag to true once connected
  }

  const db = client.db('develpoment');
  return { db, client };
}

export { connectToDatabase };
