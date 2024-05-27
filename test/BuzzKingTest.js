const { ethers } = require('hardhat');

(async () => {
  const { expect } = await import('chai');

  describe('BuzzKing', function () {
    let BuzzKing, buzzKing, BuzzTokens, buzzTokens, ETH20, eth20, owner, addr1, addr2;

    beforeEach(async function () {
      // Get the ContractFactories and Signers here.
      BuzzTokens = await ethers.getContractFactory('BuzzTokens'); // Assuming BuzzTokens is another contract you have
      ETH20 = await ethers.getContractFactory('ETH20'); // Assuming ETH20 is another contract you have
      BuzzKing = await ethers.getContractFactory('BuzzKing');

      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

      // Deploy the contracts
      buzzTokens = await BuzzTokens.deploy();
      await buzzTokens.deployed();

      eth20 = await ETH20.deploy();
      await eth20.deployed();

      buzzKing = await BuzzKing.deploy(buzzTokens.address, eth20.address);
      await buzzKing.deployed();
    });

    describe('Deployment', function () {
      it('Should set the right owner', async function () {
        expect(await buzzKing.owner()).to.equal(owner.address);
      });

      it('Should set the correct token addresses', async function () {
        expect(await buzzKing.buzzTokens()).to.equal(buzzTokens.address);
        expect(await buzzKing.ETH20()).to.equal(eth20.address);
      });
    });

    describe('Create Binary', function () {
      it('Should create a new binary market', async function () {
        // Assume tokens are supplied to addr1
        await buzzTokens.setTokenSupply(addr1.address, 1000);
        await buzzTokens.addMarket(addr1.address, buzzKing.address, "binary");

        await expect(buzzKing.connect(addr1).createBinary())
          .to.emit(buzzKing, 'NewMarket');
      });
    });

    describe('Mint Binary Position', function () {
      it('Should mint a binary position', async function () {
        // Assume tokens are supplied to addr1 and addr2
        await buzzTokens.setTokenSupply(addr1.address, 1000);
        await buzzTokens.addMarket(addr1.address, buzzKing.address, "binary");

        await buzzKing.connect(addr1).createBinary();
        let buzzMarketAddress = await buzzTokens.markets(addr1.address, 0);

        await expect(buzzKing.connect(addr2).mintBinaryposition(addr1.address, buzzMarketAddress, 100, true))
          .to.emit(buzzKing, 'NewMint');
      });
    });

    describe('Redeem Binary During', function () {
      it('Should redeem binary during', async function () {
        // Assume tokens are supplied to addr1 and addr2
        await buzzTokens.setTokenSupply(addr1.address, 1000);
        await buzzTokens.addMarket(addr1.address, buzzKing.address, "binary");

        await buzzKing.connect(addr1).createBinary();
        let buzzMarketAddress = await buzzTokens.markets(addr1.address, 0);

        await buzzKing.connect(addr2).mintBinaryposition(addr1.address, buzzMarketAddress, 100, true);

        await expect(buzzKing.connect(addr2).redeemBinaryDuring(addr1.address, buzzMarketAddress, 50, true))
          .to.emit(buzzKing, 'RedeemDuring');
      });
    });

    describe('Redeem Binary After', function () {
      it('Should redeem binary after', async function () {
        // Assume tokens are supplied to addr1 and addr2
        await buzzTokens.setTokenSupply(addr1.address, 1000);
        await buzzTokens.addMarket(addr1.address, buzzKing.address, "binary");

        await buzzKing.connect(addr1).createBinary();
        let buzzMarketAddress = await buzzTokens.markets(addr1.address, 0);

        await buzzKing.connect(addr2).mintBinaryposition(addr1.address, buzzMarketAddress, 100, true);

        await expect(buzzKing.connect(addr2).redeemBinaryAfter(addr1.address, buzzMarketAddress))
          .to.emit(buzzKing, 'RedeemAfter');
      });
    });
  });
})();
