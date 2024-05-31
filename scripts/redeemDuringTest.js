const { Contract, ContractFactory, utils } = require("ethers");
const { waffle } = require("hardhat");

const artifacts = {
    ETH20ABI: require("../artifacts/contracts/ETH20.sol/ETH20.json"),
    BUZZKINGABI: require("../artifacts/contracts/BuzzKing.sol/BuzzKing.json"),
    BUZZTOKENSABI: require("../artifacts/contracts/BuzzTokens.sol/BuzzTokens.json"),
    BUZZBINARYABI: require("../artifacts/contracts/BuzzBinary.sol/BuzzBinary.json")
};

const protocolFeeAmount = "0.05"
const creatorFeeAmount = "0.05"
const user1TokenC1Buy = "10000"
const user1MintYESAmount = "100";
const user1MintNOAmount = "100";
const user1MintC1MarketDirection = true;
const redeemDirection = true;
const answer = true;

async function main() {
    const [owner, creator1, user1, protocolfee] = await ethers.getSigners();
    const provider = waffle.provider;

    console.log("Deploying Contracts");
    console.log("-------------------------------------");
    const ETH20 = new ContractFactory(artifacts.ETH20ABI.abi, artifacts.ETH20ABI.bytecode, owner);
    const ETH20Contract = await ETH20.deploy("Ether", "ETH");
    const buzzTokens = new ContractFactory(artifacts.BUZZTOKENSABI.abi, artifacts.BUZZTOKENSABI.bytecode, owner);
    const BuzzTokensContract = await buzzTokens.deploy(ETH20Contract.address);
    const buzzKing = new ContractFactory(artifacts.BUZZKINGABI.abi, artifacts.BUZZKINGABI.bytecode, owner);
    const BuzzKingContract = await buzzKing.deploy(BuzzTokensContract.address, ETH20Contract.address);
    console.log("Finished Deploying Contracts");
    console.log("-------------------------------------");

    console.log("Setting Up Contracts");
    console.log("-------------------------------------");
    await ETH20Contract.connect(owner).setBuzzTokens(BuzzTokensContract.address);
    await BuzzTokensContract.connect(owner).setKing(BuzzKingContract.address);
    await BuzzTokensContract.connect(owner).setFeeDestination(protocolfee.address);
    await BuzzTokensContract.connect(owner).setProtocolFeePercent(utils.parseEther(protocolFeeAmount));
    await BuzzTokensContract.connect(owner).setCreatorFeePercent(utils.parseEther(creatorFeeAmount));
    console.log("Finished Setting up Contracts");
    console.log("-------------------------------------");

    console.log("Minting ETH20 to User1 Only");
    console.log("-------------------------------------");
    console.log("STATE BEFORE");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log("-------------------------------------");
    // await ETH20Contract.connect(owner).specialMint(creator1.address);
    await ETH20Contract.connect(owner).specialMint(user1.address);
    console.log("STATE AFTER");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log("Finished Minting ETH20");
    console.log("-------------------------------------");

    console.log("User1 buys tokens Creator");
    console.log("-------------------------------------");
    console.log("STATE BEFORE");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    await BuzzTokensContract.connect(user1).buyTokens(creator1.address, utils.parseEther(user1TokenC1Buy));
    console.log("-------------------------------------");
    console.log("STATE AFTER");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log("-------------------------------------");

    console.log("Creator 1 makes a Binary Market");
    console.log("-------------------------------------");
    const tx = await BuzzKingContract.connect(creator1).createBinary();
    const receipt = await tx.wait();
    let marketAddress;
    for (const event of receipt.events) {
        if (event.event === "NewMarket") {
            marketAddress = event.args[0];
        }
    }
    const market1Contract = new Contract(marketAddress, artifacts.BUZZBINARYABI.abi, provider);
    console.log(`Market Details`);
    console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    console.log(`finalValue: ${await market1Contract.finalValue()}`);
    console.log(`isFinalValueSet: ${await market1Contract.isFinalValueSet()}`);
    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log(`Finished creating a market`);
    console.log("-------------------------------------");


    console.log("User1 Mints Yes Position");
    console.log("-------------------------------------");
    console.log("STATE BEFORE");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log("-------------------------------------");
    await BuzzKingContract.connect(user1).mintBinaryPosition(creator1.address, market1Contract.address, utils.parseEther(user1MintYESAmount), user1MintC1MarketDirection);
    console.log("STATE AFTER");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log("-------------------------------------");

    // console.log("User1 Mints No Position");
    // console.log("-------------------------------------");
    // console.log("STATE BEFORE");
    // console.log("-------------------------------------");
    // console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    // console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    // console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    // console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    // console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    // console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    // console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    // console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    // console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    // console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    // console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    // console.log("-------------------------------------");
    // await BuzzKingContract.connect(user1).mintBinaryPosition(creator1.address, market1Contract.address, utils.parseEther(user1MintNOAmount), !user1MintC1MarketDirection);
    // console.log("STATE AFTER");
    // console.log("-------------------------------------");
    // console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    // console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    // console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    // console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    // console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    // console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    // console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    // console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    // console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    // console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    // console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    // console.log("-------------------------------------");

    console.log("User1 RedeemDuring");
    console.log("-------------------------------------");
    console.log("STATE BEFORE");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log("-------------------------------------");
    await BuzzKingContract.connect(user1).redeemBinaryDuring(creator1.address, market1Contract.address, (await market1Contract.addressBalances(user1.address))[redeemDirection ? 0 : 1], redeemDirection);
    console.log("STATE AFTER");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log("-------------------------------------");

    console.log("FINAL VALUE SUBMITTED");
    console.log("-------------------------------------");
    console.log("STATE BEFORE");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log("-------------------------------------");
    await BuzzKingContract.connect(creator1).submitBinaryAnswer(market1Contract.address, answer);
    console.log("STATE AFTER");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log("-------------------------------------");

    if (answer && (await market1Contract.addressBalances(user1.address))[0] > 0 || !answer && (await market1Contract.addressBalances(user1.address))[1] > 0) {
        console.log("User1 Needs to RedeemAfter");
        console.log("-------------------------------------");
        console.log("STATE BEFORE");
        console.log("-------------------------------------");
        console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
        console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
        console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
        console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
        console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
        console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
        console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
        console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
        console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
        console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
        console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
        console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
        console.log("-------------------------------------");
        await BuzzKingContract.connect(user1).redeemBinaryAfter(creator1.address, market1Contract.address);
        console.log("STATE AFTER");
        console.log("-------------------------------------");
        console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
        console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
        console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
        console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
        console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
        console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
        console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
        console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
        console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
        console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
        console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
        console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
        console.log("-------------------------------------");
    }

    // Then sell into ETH20
    console.log("User1 Sells Tokens");
    console.log("-------------------------------------");
    console.log("STATE BEFORE");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log("-------------------------------------");

    const userBalance = await BuzzTokensContract.tokensBalance(creator1.address, user1.address);
    const amountToRedeem = userBalance.sub(1)
    const supply = await BuzzTokensContract.tokensSupply(creator1.address);
    const curveConstant = await BuzzTokensContract.curveConstants(creator1.address);

    console.log(`curveConstant: ${await BuzzTokensContract.curveConstants(creator1.address)}`);
    console.log(`supply: ${supply}`);
    console.log(amountToRedeem);
    const sellCost = await BuzzTokensContract.connect(user1).getPrice(supply-amountToRedeem, amountToRedeem,curveConstant);
    console.log(sellCost);
    // await BuzzTokensContract.connect(user1).sellTokens(creator1.address, amountToRedeem);
    console.log("STATE AFTER");
    console.log("-------------------------------------");
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`User1 Token Balance of Creator1: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, user1.address))}`);
    console.log(`User1 Position Balance: YESAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[0])} && NOAMOUNT: ${utils.formatUnits((await market1Contract.addressBalances(user1.address))[1])}`);
    console.log(`Binary Market Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address))}`);
    console.log(`TotalYesPool: ${utils.formatUnits(await market1Contract.totalYesPool())}`);
    console.log(`TotalNoPool: ${utils.formatUnits(await market1Contract.totalNoPool())}`);
    console.log(`K value: ${utils.formatUnits(await market1Contract.K())}`);
    console.log(`Total Supply of Creator1 Tokens: ${utils.formatUnits(await BuzzTokensContract.tokensSupply(creator1.address))}`);
    console.log(`ProtocolFee ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`BuzzTokens ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log("-------------------------------------");
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run --network localhost scripts/redeemDuringTest.js