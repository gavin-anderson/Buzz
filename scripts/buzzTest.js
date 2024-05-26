const { Contract, ContractFactory, utils } = require("ethers");
const { waffle } = require("hardhat");

const artifacts = {
    ETH20ABI: require("../artifacts/contracts/ETH20.sol/ETH20.json"),
    BUZZKINGABI: require("../artifacts/contracts/BuzzKing.sol/BuzzKing.json"),
    BUZZTOKENSABI: require("../artifacts/contracts/BuzzTokens.sol/BuzzTokens.json")
};

async function main() {
    const [owner, creator1, creator2, user1,user2,protocolfee] = await ethers.getSigners();
    const provider = waffle.provider;

    console.log("Deploying Contracts");
    const ETH20 = new ContractFactory(artifacts.ETH20ABI.abi, artifacts.ETH20ABI.bytecode, owner);
    const ETH20Contract = await ETH20.deploy("Ether", "ETH");

    const buzzTokens = new ContractFactory(artifacts.BUZZTOKENSABI.abi, artifacts.BUZZTOKENSABI.bytecode, owner);
    const BuzzTokensContract = await buzzTokens.deploy(ETH20Contract.address);

    const buzzKing = new ContractFactory(artifacts.BUZZKINGABI.abi, artifacts.BUZZKINGABI.bytecode, owner);
    const BuzzKingContract = await buzzKing.deploy(BuzzTokensContract.address, ETH20Contract.address);
    console.log("Finished Deploying Contracts");
    console.log("-------------------------------------");

    console.log("Setting Up Contracts");
    await ETH20Contract.connect(owner).setBuzzTokens(BuzzTokensContract.address);
    await BuzzTokensContract.connect(owner).setKing(BuzzKingContract.address);
    await BuzzTokensContract.connect(owner).setFeeDestination(protocolfee.address);
    await BuzzTokensContract.connect(owner).setProtocolFeePercent(utils.parseEther("0.05"));
    await BuzzTokensContract.connect(owner).setCreatorFeePercent(utils.parseEther("0.05"));
    await BuzzKingContract.connect(owner).setK(utils.parseEther("1000000"));
    console.log("Finished Setting up Contracts");
    console.log("-------------------------------------");

    console.log("Minting ETH20");
    await ETH20Contract.connect(owner).specialMint(creator1.address);
    await ETH20Contract.connect(owner).specialMint(creator2.address);
    await ETH20Contract.connect(owner).specialMint(user1.address);
    await ETH20Contract.connect(owner).specialMint(user2.address);
    console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`Creator2 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator2.address))}`);
    console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log("Finished Minting ETH20");
    console.log("-------------------------------------");


    console.log("User1 buys tokens of both creators ");
    // Check State
    lastpriceC1 = await BuzzTokensContract.connect(user1).lastPrice(creator1.address);
    lastpriceC2 = await BuzzTokensContract.connect(user1).lastPrice(creator2.address);
    curveConstantC1 = await BuzzTokensContract.curveConstants(creator1.address);
    curveConstantC2 = await BuzzTokensContract.curveConstants(creator2.address);
    supplyC1 = await BuzzTokensContract.tokensSupply(creator1.address);
    supplyC2 = await BuzzTokensContract.tokensSupply(creator2.address);
    console.log(`LastPrice Creator1: ${utils.formatUnits(lastpriceC1)}`);
    console.log(`LastPrice Creator2: ${utils.formatUnits(lastpriceC2)}`);
    console.log(`curveConstant Creator1: ${utils.formatUnits(curveConstantC1)}`);
    console.log(`curveConstant Creator2: ${utils.formatUnits(curveConstantC2)}`);
    console.log(`Supply Creator1: ${utils.formatUnits(supplyC1)}`);
    console.log(`Supply Creator2: ${utils.formatUnits(supplyC2)}`);
    console.log("State Before");
    console.log("-------------------------------------");

    const tx = await BuzzTokensContract.connect(user1).buyTokens(creator1.address, utils.parseEther("1"));
    // const receipt = await provider.getTransactionReceipt(tx.hash);
    // console.log(receipt);
    console.log("State After");
    console.log("-------------------------------------");
    console.log(`Protocol Fee: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator Fee: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`Contract ETH: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`user1 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log("-------------------------------------");


    // console.log("User2 buys tokens of both creators ");
    // // Check State
    // lastpriceC1 = await BuzzTokensContract.connect(user2).lastPrice(creator1.address);
    // lastpriceC2 = await BuzzTokensContract.connect(user2).lastPrice(creator2.address);
    // curveConstantC1 = await BuzzTokensContract.curveConstants(creator1.address);
    // curveConstantC2 = await BuzzTokensContract.curveConstants(creator2.address);
    // supplyC1 = await BuzzTokensContract.tokensSupply(creator1.address);
    // supplyC2 = await BuzzTokensContract.tokensSupply(creator2.address);
    // console.log(`LastPrice Creator1: ${utils.formatUnits(lastpriceC1)}`);
    // console.log(`LastPrice Creator2: ${utils.formatUnits(lastpriceC2)}`);
    // console.log(`curveConstant Creator1: ${utils.formatUnits(curveConstantC1)}`);
    // console.log(`curveConstant Creator2: ${utils.formatUnits(curveConstantC2)}`);
    // console.log(`Supply Creator1: ${utils.formatUnits(supplyC1)}`);
    // console.log(`Supply Creator2: ${utils.formatUnits(supplyC2)}`);
    // const priceuser2C1 = await BuzzTokensContract.connect(user2).getPrice(supplyC1,utils.parseEther("1"),curveConstantC1);
    // const priceuser2C2 = await BuzzTokensContract.connect(user2).getPrice(supplyC1,utils.parseEther("1"),curveConstantC1);
    // console.log(`Price Creator1: ${utils.formatUnits(priceuser2C1)}`);
    // console.log(`Price Creator2: ${utils.formatUnits(priceuser2C2)}`);
    // console.log("State Before User 2 buys");
    // console.log("-------------------------------------");

    // await BuzzTokensContract.connect(user2).buyTokens(creator1.address, utils.parseEther("1"));
    // await BuzzTokensContract.connect(user2).buyTokens(creator2.address, utils.parseEther("1"));
    // console.log(`User1 creator1Tokens Balance: ${utils.formatUnits(await BuzzTokensContract.connect(user2).tokensBalance(creator1.address, user2.address))}`);
    // console.log(`User1 creator2Tokens Balance: ${utils.formatUnits(await BuzzTokensContract.connect(user2).tokensBalance(creator2.address, user2.address))}`);
    // console.log(`User1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user2.address))}`);
    // console.log(`Protocol Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    // console.log(`Creator1 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    // console.log(`Creator2 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(creator2.address))}`);
    
    // console.log("Finished User2 buying tokens of creator");
    // console.log("-------------------------------------");

    // lastpriceC1 = await BuzzTokensContract.connect(user2).lastPrice(creator1.address);
    // lastpriceC2 = await BuzzTokensContract.connect(user2).lastPrice(creator2.address);
    // curveConstantC1 = await BuzzTokensContract.curveConstants(creator1.address);
    // curveConstantC2 = await BuzzTokensContract.curveConstants(creator2.address);
    // supplyC1 = await BuzzTokensContract.tokensSupply(creator1.address);
    // supplyC2 = await BuzzTokensContract.tokensSupply(creator2.address);
    // console.log(`LastPrice Creator1: ${utils.formatUnits(lastpriceC1)}`);
    // console.log(`LastPrice Creator2: ${utils.formatUnits(lastpriceC2)}`);
    // console.log(`curveConstant Creator1: ${utils.formatUnits(curveConstantC1)}`);
    // console.log(`curveConstant Creator2: ${utils.formatUnits(curveConstantC2)}`);
    // console.log(`Supply Creator1: ${utils.formatUnits(supplyC1)}`);
    // console.log(`Supply Creator2: ${utils.formatUnits(supplyC2)}`);
    // console.log(`User2 ETH20 Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user2.address))}`);
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });