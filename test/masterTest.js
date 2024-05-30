// INCOMPLETE
const { ethers } = require('hardhat');
const { Contract, ContractFactory, utils } = require("ethers");
const { waffle } = require("hardhat");
const assert = require('assert');


const artifacts = {
    ETH20ABI: require("../artifacts/contracts/ETH20.sol/ETH20.json"),
    BUZZKINGABI: require("../artifacts/contracts/BuzzKing.sol/BuzzKing.json"),
    BUZZTOKENSABI: require("../artifacts/contracts/BuzzTokens.sol/BuzzTokens.json")
};


describe("Buzz", function () {
    let BuzzTokens, BuzzKing, ETH20;
    let GM, creator1, creator2, user1, user2, protocolfee;
    let fee;

    beforeEach(async function () {
        [GM, creator1, creator2, user1, user2, protocolfee] = await ethers.getSigners();
        const provider = waffle.provider;
        fee = "0.05"
        const eth20 = new ContractFactory(artifacts.ETH20ABI.abi, artifacts.ETH20ABI.bytecode, GM);
        const buzzTokens = new ContractFactory(artifacts.BUZZTOKENSABI.abi, artifacts.BUZZTOKENSABI.bytecode, GM);
        const buzzKing = new ContractFactory(artifacts.BUZZKINGABI.abi, artifacts.BUZZKINGABI.bytecode, GM);

        ETH20 = await eth20.deploy("Ether", "ETH");
        BuzzTokens = await buzzTokens.deploy(ETH20.address);
        BuzzKing = await buzzKing.deploy(BuzzTokens.address, ETH20.address);

        await ETH20.connect(GM).setBuzzTokens(BuzzTokens.address);
        await BuzzTokens.connect(GM).setFeeDestination(protocolfee.address);
        await BuzzTokens.connect(GM).setProtocolFeePercent(utils.parseEther(fee));
        await BuzzTokens.connect(GM).setCreatorFeePercent(utils.parseEther(fee));

        await ETH20.connect(GM).specialMint(creator1.address);
        await ETH20.connect(GM).specialMint(creator2.address);
        await ETH20.connect(GM).specialMint(user1.address);
        await ETH20.connect(GM).specialMint(user2.address);
    });

    describe("ETH20: Ownership and control", function () {
        it("Stop an address from asking for ETH20 twice", async function () {
            try {
                await ETH20.connect(GM).specialMint(user1.address);
                assert.fail("The Minting did not revert as expected");
            } catch (error) {
                assert.strictEqual(error.message.includes("Already got ETH20"), true, "Error message should include 'Already got ETH20'");
            }

        });
        it("Stop an address from calling transferFrom", async function () {
            try {
                await ETH20.connect(GM).transferFrom(user1.address, GM.address, utils.parseEther("1"));
                assert.fail("The TransferFrom did not revert as expected");
            } catch (error) {
                assert.strictEqual(error.message.includes("only BuzzTokens Contract ETH20"), true, "Error message should include 'only BuzzTokens Contract ETH20'");
            }

        });

    });
    describe("Buzz Tokens Buy and Sell Tokens", function () {
        it("BuyTokens", async function () {
            const amountToBuy = 1.0;
            const startBalanceCreator1 = utils.formatUnits(await BuzzTokens.tokensSupply(creator1.address));
            const startBalanceCreator2 = utils.formatUnits(await BuzzTokens.tokensSupply(creator2.address));
            const startBalanceProtocol = utils.formatUnits(await BuzzTokens.tokensSupply(protocolfee.address));
            const startBalanceUser1 = utils.formatUnits(await BuzzTokens.tokensSupply(user1.address));
            const startBalanceUser2 = utils.formatUnits(await BuzzTokens.tokensSupply(user2.address));
            const expectedStartCost = await BuzzTokens.getBuyPrice(creator1.address, utils.parseEther(String(amountToBuy)));
            const expectedFee = expectedStartCost * utils.parseEther(fee) / 10**18;



            try {
                await BuzzTokens.connect(user1).buyTokens(creator1.address, utils.parseEther(String(amountTobuy)));
                await BuzzTokens.connect(user1).buyTokens(creator2.address, utils.parseEther(String(amountTobuy)));
                assert.strictEqual(utils.formatUnits(await BuzzTokens.tokensSupply(creator1.address)), "1.0", "Balance of Supply should match supply + new amount");
                assert.strictEqual(utils.formatUnits(await BuzzTokens.tokensBalance(creator1.address, user1.address)), "1.0", "Balance of user1 should be balance of user1 + amount");
                assert.strictEqual(utils.formatUnits(await BuzzTokens.tokensSupply(creator2.address)), "1.0", "Balance of Supply should match supply + new amount C2");
                assert.strictEqual(utils.formatUnits(await BuzzTokens.tokensBalance(creator2.address, user1.address)), "1.0", "Balance of user1 should be balance of user1 + amount C2");
                // assert.equal(utils.formatUnits(await ETH20.balanceOf(creator1.address)), String(amountTobuy/20), "Creator Fee is off");
                // assert.equal(utils.formatUnits(await ETH20.balanceOf(protocolfee)), String(amountTobuy/20), "Protocol fee is off");
            } catch (error) {
                assert.fail(`Transaction failed with error: ${error.message}`);

            }
        });
        it("Balance for fees", async function(){
            const amountTobuy = 100.0;
            const startingBalanceCreator1 = utils.formatUnits(await BuzzTokens.tokensSupply(creator1.address));
            const startBalanceCreator2 = utils.formatUnits(await BuzzTokens.tokensSupply(creator2.address));
            const startBalanceProtocol = utils.formatUnits(await BuzzTokens.tokensSupply(protocolfee.address));
           
            try {
                await BuzzTokens.connect(user1).buyTokens(creator1.address, utils.parseEther(String(amountTobuy)));
                await BuzzTokens.connect(user1).buyTokens(creator2.address, utils.parseEther(String(amountTobuy)));
               
                assert.equal(utils.formatUnits(await ETH20.balanceOf(creator1.address)-startingBalanceCreator1), String(amountTobuy/20), "Creator Fee is off");
                assert.equal(utils.formatUnits(await ETH20.balanceOf(protocolfee)), String(amountTobuy/20), "Protocol fee is off");
            } catch (error) {
                assert.fail(`Transaction failed with error: ${error.message}`);

            }
        })

    });

});