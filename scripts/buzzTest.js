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
// Market 1
const user1TokenC1Buy = "1000"
const user1MintYESAmount = "900";
const user1MintNOAmount = "10";
const user1MintC1MarketDirection = true;
const answer = true;



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
    await BuzzTokensContract.connect(owner).setProtocolFeePercent(utils.parseEther(protocolFeeAmount));
    await BuzzTokensContract.connect(owner).setCreatorFeePercent(utils.parseEther(creatorFeeAmount));
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
    console.log("-------------------------------------");
    console.log("State Before");
    // Check State
    lastpriceC1 = await BuzzTokensContract.connect(user1).lastPrice(creator1.address);
    curveConstantC1 = await BuzzTokensContract.curveConstants(creator1.address);
    supplyC1 = await BuzzTokensContract.tokensSupply(creator1.address);
    console.log(`LastPrice Creator1: ${utils.formatUnits(lastpriceC1)}`);
    console.log(`curveConstant Creator1: ${utils.formatUnits(curveConstantC1)}`);
    console.log(`Supply Creator1: ${utils.formatUnits(supplyC1)}`);
    console.log("State Before Buying Tokens");
    console.log("-------------------------------------");

    await BuzzTokensContract.connect(user1).buyTokens(creator1.address, utils.parseEther(user1TokenC1Buy));
    console.log("State After Buying Tokens");
    console.log("-------------------------------------");
    console.log(`Protocol Fee: ${utils.formatUnits(await ETH20Contract.balanceOf(protocolfee.address))}`);
    console.log(`Creator1 Fee: ${utils.formatUnits(await ETH20Contract.balanceOf(creator1.address))}`);
    console.log(`Contract ETH: ${utils.formatUnits(await ETH20Contract.balanceOf(BuzzTokensContract.address))}`);
    console.log(`user1 ETH Balance: ${utils.formatUnits(await ETH20Contract.balanceOf(user1.address))}`);
    console.log(`user1 C1Token Balance: ${utils.formatUnits(await BuzzTokensContract.tokensBalance(creator1.address,user1.address))}`);
    console.log("-------------------------------------");

  

    console.log("Creator 1 makes a market");
    const tx = await BuzzKingContract.connect(creator1).createBinary();
    const receipt = await tx.wait();
    let marketAddress;
    for (const event of receipt.events){
        if (event.event === "NewMarket"){
            marketAddress = event.args[0];
        }
    }
    const market1Contract = new Contract(marketAddress,artifacts.BUZZBINARYABI.abi,provider);
    const m1Creator = await market1Contract.creator();
    const m1King = await market1Contract.king();
    const m1KValue = await market1Contract.K();
    // console.log(`Creator Address: ${creator1.address} && Stored Creator Address: ${m1Creator}`);
    // console.log(`King Address: ${BuzzKingContract.address} && Stored King Address: ${m1King}`);
    console.log(`K value: ${m1KValue}`);
    console.log(`totalYesPool: ${await market1Contract.totalYesPool()}`);
    console.log(`totalNoPool: ${await market1Contract.totalNoPool()}`);
    console.log(`Finished creating a market: ${marketAddress}`);
    console.log("-------------------------------------");

    console.log("User1 mints yes position in creator1 market");
    console.log(`User1 balance of creatorTokens: ${await BuzzTokensContract.tokensBalance(creator1.address,user1.address)}`);
    await BuzzKingContract.connect(user1).mintBinaryPosition(creator1.address,market1Contract.address, utils.parseEther(user1MintYESAmount), user1MintC1MarketDirection);
    console.log(`User1 Creator1Token Balance: ${await BuzzTokensContract.tokensSupply(user1.address)}`);
    console.log(`User1 yesAmount: ${await market1Contract.addressBalances(user1.address)}`);
    console.log(`K value: ${await market1Contract.K()}`);
    console.log(`totalYesPool: ${await market1Contract.totalYesPool()}`);
    console.log(`totalNoPool: ${await market1Contract.totalNoPool()}`);
    console.log("-------------------------------------");

    console.log("User1 mints No position in creator1 market");
    console.log(`User1 balance of creatorTokens: ${await BuzzTokensContract.tokensBalance(creator1.address,user1.address)}`);
    await BuzzKingContract.connect(user1).mintBinaryPosition(creator1.address,market1Contract.address, utils.parseEther(user1MintNOAmount), false);
    console.log(`User1 Creator1Token Balance: ${await BuzzTokensContract.tokensSupply(user1.address)}`);
    console.log(`User1 NoAmount: ${await market1Contract.addressBalances(user1.address)}`);
    console.log(`K value: ${await market1Contract.K()}`);
    console.log(`totalYesPool: ${await market1Contract.totalYesPool()}`);
    console.log(`totalNoPool: ${await market1Contract.totalNoPool()}`);
    console.log("-------------------------------------");

    

    console.log("User 1 redeems during for Yes");
    temp = await market1Contract.addressBalances(user1.address);
    totalYesPool = await market1Contract.totalYesPool();
    totalNoPool = await market1Contract.totalNoPool();
    K = await market1Contract.K();
    user1c1Balance = await BuzzTokensContract.tokensBalance(creator1.address, user1.address);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    console.log("State Before");
    console.log("-------------------------------------");
    console.log(`Market balance C1: ${contractC1Balance} && ${utils.formatUnits(contractC1Balance)}`);
    console.log(`User1 C1 Balance: ${user1c1Balance} && ${utils.formatUnits(user1c1Balance)}`);
    console.log(`User1 balance Yes/No: ${temp}`);
    console.log(`Total Yes Pool: ${totalYesPool} && ${utils.formatUnits(totalYesPool)}`);
    console.log(`Total No Pool: ${totalNoPool} && ${utils.formatUnits(totalNoPool)}`);
    console.log(`K Value: ${K} && ${utils.formatUnits(K)}`);
    console.log("-------------------------------------");
    

    await BuzzKingContract.connect(user1).redeemBinaryDuring(creator1.address, market1Contract.address,temp[0],true);
    console.log("State After");
    temp = await market1Contract.addressBalances(user1.address);
    totalYesPool = await market1Contract.totalYesPool();
    totalNoPool = await market1Contract.totalNoPool();
    K = await market1Contract.K();
    user1c1Balance = await BuzzTokensContract.tokensBalance(creator1.address, user1.address);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    console.log(`Market balance C1: ${contractC1Balance} && ${utils.formatUnits(contractC1Balance)}`);
    console.log(`User1 C1 Balance: ${user1c1Balance} && ${utils.formatUnits(user1c1Balance)}`);
    console.log(`User1 balance Yes/No: ${temp}`);
    console.log(`Total Yes Pool: ${totalYesPool} && ${utils.formatUnits(totalYesPool)}`);
    console.log(`Total No Pool: ${totalNoPool} && ${utils.formatUnits(totalNoPool)}`);
    console.log(`K Value: ${K} && ${utils.formatUnits(K)}`);
    console.log("-------------------------------------");

    console.log("User 1 redeems during for No");
    temp = await market1Contract.addressBalances(user1.address);
    totalYesPool = await market1Contract.totalYesPool();
    totalNoPool = await market1Contract.totalNoPool();
    K = await market1Contract.K();
    user1c1Balance = await BuzzTokensContract.tokensBalance(creator1.address, user1.address);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    console.log("State Before");
    console.log("-------------------------------------");
    console.log(`Market balance C1: ${contractC1Balance} && ${utils.formatUnits(contractC1Balance)}`);
    console.log(`market balance C1: ${contractC1Balance} && ${utils.formatUnits(contractC1Balance)}`)
    console.log(`User1 C1 Balance: ${user1c1Balance} && ${utils.formatUnits(user1c1Balance)}`);
    console.log(`user1 balance YesNo: ${temp}`);
    console.log(`Total Yes Pool: ${totalYesPool} && ${utils.formatUnits(totalYesPool)}`);
    console.log(`Total No Pool: ${totalNoPool} && ${utils.formatUnits(totalNoPool)}`);
    console.log(`K Value: ${K} && ${utils.formatUnits(K)}`);
    console.log("-------------------------------------");    

    await BuzzKingContract.connect(user1).redeemBinaryDuring(creator1.address, market1Contract.address,temp[1],false);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    console.log("State After");
    console.log("-------------------------------------");
    console.log(`Market balance C1: ${contractC1Balance} && ${utils.formatUnits(contractC1Balance)}`);
    temp = await market1Contract.addressBalances(user1.address);
    totalYesPool = await market1Contract.totalYesPool();
    totalNoPool = await market1Contract.totalNoPool();
    K = await market1Contract.K();
    user1c1Balance = await BuzzTokensContract.tokensBalance(creator1.address, user1.address);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    console.log(`User1 C1 Balance: ${user1c1Balance} && ${utils.formatUnits(user1c1Balance)}`);
    console.log(`user1 balance yesAmount: ${temp}`);
    console.log(`Total Yes Pool: ${totalYesPool} && ${utils.formatUnits(totalYesPool)}`);
    console.log(`Total No Pool: ${totalNoPool} && ${utils.formatUnits(totalNoPool)}`);
    console.log(`K Value: ${K} && ${utils.formatUnits(K)}`);

    // Final value submitted
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    console.log(`market balance C1: ${contractC1Balance} && ${utils.formatUnits(contractC1Balance)}`);
    console.log("FINAL VALUE SUBMITTED");
    await BuzzKingContract.connect(creator1).submitBinaryAnswer(market1Contract.address,answer);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    console.log(`market balance C1: ${contractC1Balance} && ${utils.formatUnits(contractC1Balance)}`)
    console.log("-------------------------------------");
    // User1 Redeem Final
    temp = await market1Contract.addressBalances(user1.address);
    totalYesPool = await market1Contract.totalYesPool();
    totalNoPool = await market1Contract.totalNoPool();
    K = await market1Contract.K();
    user1c1Balance = await BuzzTokensContract.tokensBalance(creator1.address, user1.address);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    console.log("State Before");
    console.log("-------------------------------------");
    console.log(`market balance C1: ${contractC1Balance} && ${utils.formatUnits(contractC1Balance)}`)
    console.log(`User1 C1 Balance: ${user1c1Balance} && ${utils.formatUnits(user1c1Balance)}`);
    console.log(`user1 balance YesNo: ${temp}`);
    console.log(`Total Yes Pool: ${totalYesPool} && ${utils.formatUnits(totalYesPool)}`);
    console.log(`Total No Pool: ${totalNoPool} && ${utils.formatUnits(totalNoPool)}`);
    console.log(`K Value: ${K} && ${utils.formatUnits(K)}`);
    console.log("-------------------------------------");    

    await BuzzKingContract.connect(user1).redeemBinaryAfter(creator1.address, market1Contract.address);
    console.log("State After");
    temp = await market1Contract.addressBalances(user1.address);
    totalYesPool = await market1Contract.totalYesPool();
    totalNoPool = await market1Contract.totalNoPool();
    K = await market1Contract.K();
    user1c1Balance = await BuzzTokensContract.tokensBalance(creator1.address, user1.address);
    contractC1Balance = await BuzzTokensContract.tokensBalance(creator1.address, market1Contract.address);
    console.log(`Market balance C1: ${contractC1Balance} && ${utils.formatUnits(contractC1Balance)}`)
    console.log(`User1 C1 Balance: ${user1c1Balance} && ${utils.formatUnits(user1c1Balance)}`);
    console.log(`User1 balance yesAmount: ${temp}`);
    console.log(`Total Yes Pool: ${totalYesPool} && ${utils.formatUnits(totalYesPool)}`);
    console.log(`Total No Pool: ${totalNoPool} && ${utils.formatUnits(totalNoPool)}`);
    console.log(`K Value: ${K} && ${utils.formatUnits(K)}`);


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });