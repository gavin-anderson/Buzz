import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 45000,
  retryWrites: true
});

let isConnected = false;
let connectionCount = 0;

export async function connectToDatabase() {
  if (!isConnected) {
    await client.connect();
    connectionCount += 1;
    console.log(connectionCount);
    isConnected = true;
  }

  const db = client.db('development');
  return { db, client };
}
