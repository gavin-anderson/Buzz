require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ethers } = require('ethers');
const { AlphaRouter, SwapOptionsSwapRouter02, SwapType } = require('@uniswap/smart-order-router');
const { ChainId } = require('@uniswap/sdk-core');
const { Token, CurrencyAmount, Percent, TradeType } = require('@uniswap/sdk-core');
const Joi = require('joi');

const buzzKingABI = require("./abi/BuzzKing.json").abi;
const buzzSharesABI = require("./abi/BuzzShares.json").abi;
const faucetABI = require("./abi/Faucet.json").abi;

// Enable CORS for client-side
// Middleware to parse JSON bodies
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectionString = process.env.MONGODB_URI;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Schemas
const Schema = mongoose.Schema;

// MetaData Map
const metadataMap = new Map();

// event NewMarket(address marketAddress, string marketType);
// event NewMint(address marketAddress, address subject, address user, uint256 amountSubjectSharesTaken, uint256 yesOrNoGiven, bool yesOrNo);
// event RedeemDuringBinary(address marketAddress, address subject, address user, uint256 yesOrNoTaken, uint256 amountSubjectSharesGiven, bool yesOrNo);
// event RedeemAfterBinary(address marketAddress, address subject, address user, uint256 amountSubjectSharesGiven);
// event Trade(address trader, address subject, bool isBuy, uint256 shareAmount, uint256 ethAmount, uint256 protocolEthAmount, uint256 subjectEthAmount, uint256 supply);

// Schemas for MongoDB
// Schema for Created Markets Event Emitted by Scalar Factory
const allMarketsSchema = new Schema({
    name: String,
    description: String,
    marketAddress: String,
    marketType: String,
    expiry: Date,
    creator: String,
    transactionHash: String,
    awaitingMetadata: { type: Boolean, default: false },
});

const allShareTransactionsSchema = new Schema({
    user: String,
    creator: String,
    isBuy: Boolean,
    shareAmount: Number,
    ethAmount: Number,
    protocolEthAmount: Number,
    subjectEthAmount: Number,
    supplyTotal: Number
});

const allMarketTransactionsSchema = new Schema({
    marketAddress: String,
    creator: String,
    user: String,
    sharesAmount: Number,
    yesAmount: Number,
    noAmount: Number,
    isMint: Boolean
});
// Validation Schemas for post requests
// Schema for metaData submissions
const metadataSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    expiry: Joi.date().required(),
    transactionHash: Joi.string().required()
});

// Middleware Validation
// Validation for metaData
const validateMetadata = (req, res, next) => {
    const { error } = metadataSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Invalid metadata submission", details: error.details });
    }
    next();
};
// Validation for Ethereum Address
const validateEthereumAddress= (req,res,next)=>{
    const {user} = req.body;
    if (/^0x[a-fA-F0-9]{40}$/.test(user)) {
        next();
    } else {
        console.log("Not a valid Ethereum Address");
        res.status(400).json({ message: "Invalid Ethereum address format." });
    }
}
// Validation for Market Address
const validateMarketAddress = (req, res, next) => {
    const { marketAddress } = req.params;
    // Regex to check if it's a valid Ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(marketAddress)) {
        next();
    } else {
        res.status(400).json({ message: "Invalid Ethereum address format." });
    }
};

//Validation for Empty request
const ensureEmptyRequestBody = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        next();
    } else {
        res.status(400).json({ message: "Request body must be empty." });
    }
}

// Create models
const marketData = mongoose.model('MarketData', allMarketsSchema);
const shareTradesData = mongoose.model('SharesData', allShareTransactionsSchema);
const marketTradesData = mongoose.model('MarketTradesData', allMarketTransactionsSchema)
// REST API endPoints

// Post Requests
// Faucet
app.post('/request-sepoliaEth',validateEthereumAddress, async (req,res) =>{
    console.log("Recieved Faucet Request");
    console.log(req.body);
    try{
        const rpcUrl = process.env.HARDHAT_URL;
        const provider = new ethers.getDefaultProvider(rpcUrl);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        const faucetContract = new ethers.Contract(process.env.FAUCET_ADDRESS, faucetABI,wallet);
        const txResponse = await faucetContract.requestEth(req.body.user);
        const receipt = await txResponse.wait();
        console.log(receipt);
        console.log(`Transaction hash: ${receipt.hash}`);
        res.status(201).json({ message: 'Sepolia Eth Sent', data: receipt.hash });
        
    }catch(error){
        console.log("Failed to send ETH");
        res.status(500).json({ message: 'Error Requesting Eth', error: error });
    }

});
// used for submitting meta data on created market
app.post('/submit-metadata', validateMetadata, async (req, res) => {
    console.log(" Recieved Metadata");
    console.log(req.body);
    try {
        const newMetadata = req.body;
        const transactionHash = newMetadata.transactionHash;
        const market = await marketData.findOne({ transactionHash: transactionHash, awaitingMetadata: true });
        console.log(`Returned Value of Search for transactionHash and awaitingMetaData : true  ${market}`);
        if (market) {
            Object.assign(market, newMetadata, { awaitingMetadata: false });
            await market.save();
            console.log('Joined metadata and market data saved:', market);
            res.status(201).json({ message: 'Market Event Found Before MetaData Arrived', data: newData });
        } else {
            metadataMap.set(transactionHash, newMetadata)
            console.log(`Data Saved in Dict`);
            res.status(201).json({ message: 'Data submitted no event yet', data: newData });

        }

    } catch (error) {
        res.status(500).json({ message: 'Error submitting data', error: error });
    }
});


// Get Requests
// Used to grab all markets
app.get('/get-markets', ensureEmptyRequestBody, async (req, res) => {
    try {
        const allData = await marketData.find({ ticker: { $ne: "" } });
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching market data', error: error });
    }
});
// Used to grab a specific market by ID
app.get('/get-market/:marketAddress', validateMarketAddress, async (req, res) => {
    try {
        const market = await marketData.findOne({ marketAddress: req.params.marketAddress });
        if (!market) {
            return res.status(404).json({ message: 'Market not found' });
        }
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching market data', error: error });
    }
});

// Contract listener for Markets Created
async function setupContractListeners() {
    const rpcUrl = process.env.HARDHAT_URL;
    const provider = new ethers.getDefaultProvider(rpcUrl);

    const buzzKingAddress = process.env.BUZZKING_ADDRESS;
    const buzzSharesAddress = process.env.BUZZSHARES_ADDRESS;

    const buzzKingContract = new ethers.Contract(buzzKingAddress, buzzKingABI, provider);
    const buzzSharesContract = new ethers.Contract(buzzSharesAddress, buzzSharesABI, provider);

    let marketCreated;
    let mintAction;
    let redeemDuring;
    let redeemAfter;
    let shareTraded;

    try {
        marketCreated = buzzKingContract.filters.NewMarket();
        mintAction = buzzKingContract.filters.NewMint();
        redeemDuring = buzzKingContract.filters.RedeemDuring();
        redeemAfter = buzzKingContract.filters.RedeemAfter();
        shareTraded = buzzSharesContract.filters.Trade();

    } catch (error) {
        console.log(error);
        console.error(error);
    }
    // New Market Created Listener
    buzzKingContract.on(marketCreated, async (eventPayload) => {
        try {
            console.log("MARKET CREATED");
            const args = eventPayload.args;
            console.log(`Arguments in eventPayload ${args}`);
            const [marketAddress, creator, marketType] = args;

            const _transactionHash = eventPayload.log.transactionHash;
            console.log(`TransactionHash: ${_transactionHash}`);

            // Find matching metadata
            if (metadataMap.has(_transactionHash)) {
                // Metadata found, join metadata and market data and delete metadata from map
                console.log("Found it");
                const metadata = metadataMap.get(_transactionHash);
                metadataMap.delete(_transactionHash);
                const newMarketData = new marketData({
                    ...metadata,
                    marketAddress: marketAddress.toString(),
                    marketType: marketType,
                    creator: creator.toString(),
                    transactionHash: _transactionHash,
                    awaitingMetadata: false

                });
                await newMarketData.save();
                console.log('Joined metadata and market data saved:', newMarketData);
            } else {
                // No matching metadata found, create new market data
                const newMarketData = new marketData({
                    name: "",
                    expiry: "",
                    description: "",
                    marketAddress: marketAddress.toString(),
                    marketType: marketType,
                    creator: creator.toString(),
                    transactionHash: _transactionHash,
                    awaitingMetadata: true
                });
                await newMarketData.save();
                console.log('New market data saved without meta data:', newMarketData);
            }
        } catch (error) {
            console.error('Error handling event:', error);
        }

        console.log("Finished Process");
        console.log("----------------------------");
    });

    buzzKingContract.on(mintAction, async (eventPayload) => {
        try {
            console.log("NEW MINT");
            const args = eventPayload.args;
            console.log(`Arguments in eventPayload ${args}`);
            const [marketAddress, creator, user, sharesAmount, yesOrNoAmount, yesOrNo] = args;
            const newMarketTransaction = new marketTradesData({
                marketAddress: marketAddress.toString(),
                creator: creator.toString(),
                user: user.toString(),
                sharesAmount: sharesAmount,
                yesAmount: yesOrNo ? yesOrNoAmount : 0,
                noAmount: yesOrNo ? 0 : yesOrNoAmount,
                isMint: true
            });
            await newMarketTransaction.save();
            console.log("Finished Process");
            console.log("----------------------------");
        } catch (error) {
            console.log(error);
        }
    });

    buzzKingContract.on(redeemDuring, async (eventPayload) => {
        try {
            console.log("NEW REDEEM DURING");
            console.log("Finished Process");
            const args = eventPayload.args;
            const [marketAddress, creator, user, sharesAmount, yesOrNoAmount, yesOrNo] = args;
            const newMarketTransaction = new marketTradesData({
                marketAddress: marketAddress.toString(),
                creator: creator.toString(),
                user: user.toString(),
                sharesAmount: sharesAmount,
                yesAmount: yesOrNo ? yesOrNoAmount : 0,
                noAmount: yesOrNo ? 0 : yesOrNoAmount,
                isMint: false
            });
            await newMarketTransaction.save();
            console.log("----------------------------");
        } catch (error) {
            console.log(error);
        }
    });

    buzzKingContract.on(redeemAfter, async (eventPayload) => {
        try {
            console.log("NEW REDEEM AFTER");
            const args = eventPayload.args;
            const [marketAddress, creator, user, sharesAmount, yesAmount, noAmount] = args;
            const newMarketTransaction = new marketTradesData({
                marketAddress: marketAddress.toString(),
                creator: creator.toString(),
                user: user.toString(),
                sharesAmount: sharesAmount,
                yesAmount: yesAmount,
                noAmount: noAmount,
                isMint: false
            });
            await newMarketTransaction.save();
            console.log("Finished Process");
            console.log("----------------------------");
        } catch (error) {
            console.log(error);
        }
    });

    buzzSharesContract.on(shareTraded, async (eventPayload) => {
        try {
            console.log("NEW SHARE TRADE");
            const args = eventPayload.args;
            const [user, creator, isBuy, shareAmount, ethAmount, protocolEthAmount, subjectEthAmount, supplyTotal] = args;
            const newShareTransaction = new shareTradesData({
                user: user,
                creator: creator,
                isBuy: isBuy,
                shareAmount: shareAmount,
                ethAmount: ethAmount,
                protocolEthAmount: protocolEthAmount,
                subjectEthAmount: subjectEthAmount,
                supplyTotal: supplyTotal
            });
            newShareTransaction.save();
            console.log("Finished Process");
            console.log("----------------------------");
        } catch (error) {
            console.log(error);
        }
    });
}
// Set up contract listeners
setupContractListeners();

// Set the port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// node server.js
