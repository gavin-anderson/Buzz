const { ethers } = require('hardhat');

(async () => {
  const { expect } = await import('chai');

  describe('BuzzTokens', function () {
    let BuzzTokens, buzzTokens, ETH20, eth20, owner, addr1, addr2;

    beforeEach(async function () {
      // Get the ContractFactories and Signers here.
      ETH20 = await ethers.getContractFactory('IETH20');
      BuzzTokens = await ethers.getContractFactory('BuzzTokens');

      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

      // Deploy the contracts
      eth20 = await ETH20.deploy();
      await eth20.deployed();

      buzzTokens = await BuzzTokens.deploy(eth20.address);
      await buzzTokens.deployed();
    });

    describe('Deployment', function () {
      it('Should set the right owner', async function () {
        expect(await buzzTokens.owner()).to.equal(owner.address);
      });

      it('Should set the correct token address', async function () {
        expect(await buzzTokens.token()).to.equal(eth20.address);
      });
    });

    describe('Setters', function () {
      it('Should set the king address', async function () {
        await buzzTokens.setKing(addr1.address);
        expect(await buzzTokens.king()).to.equal(addr1.address);
      });

      it('Should set the fee destination address', async function () {
        await buzzTokens.setFeeDestination(addr2.address);
        expect(await buzzTokens.protocolFeeDestination()).to.equal(addr2.address);
      });

      it('Should set the protocol fee percent', async function () {
        await buzzTokens.setProtocolFeePercent(500); // 0.5%
        expect(await buzzTokens.protocolFeePercent()).to.equal(500);
      });

      it('Should set the creator fee percent', async function () {
        await buzzTokens.setCreatorFeePercent(1000); // 1%
        expect(await buzzTokens.creatorFeePercent()).to.equal(1000);
      });
    });

    describe('Token Operations', function () {
      beforeEach(async function () {
        await buzzTokens.setKing(owner.address);
      });

      it('Should buy tokens', async function () {
        await buzzTokens.setProtocolFeePercent(100); // 0.1%
        await buzzTokens.setCreatorFeePercent(200); // 0.2%

        await eth20.mint(addr1.address, ethers.utils.parseEther('1000'));
        await eth20.connect(addr1).approve(buzzTokens.address, ethers.utils.parseEther('1000'));

        await buzzTokens.connect(addr1).buyTokens(owner.address, 100);

        expect(await buzzTokens.tokensBalance(owner.address, addr1.address)).to.equal(100);
        expect(await buzzTokens.tokensSupply(owner.address)).to.equal(100);
      });

      it('Should sell tokens', async function () {
        await buzzTokens.setProtocolFeePercent(100); // 0.1%
        await buzzTokens.setCreatorFeePercent(200); // 0.2%

        await eth20.mint(addr1.address, ethers.utils.parseEther('1000'));
        await eth20.connect(addr1).approve(buzzTokens.address, ethers.utils.parseEther('1000'));

        await buzzTokens.connect(addr1).buyTokens(owner.address, 100);
        await buzzTokens.connect(addr1).sellTokens(owner.address, 50);

        expect(await buzzTokens.tokensBalance(owner.address, addr1.address)).to.equal(50);
        expect(await buzzTokens.tokensSupply(owner.address)).to.equal(50);
      });

      it('Should transfer tokens to contract', async function () {
        await buzzTokens.setProtocolFeePercent(100); // 0.1%
        await buzzTokens.setCreatorFeePercent(200); // 0.2%

        await eth20.mint(addr1.address, ethers.utils.parseEther('1000'));
        await eth20.connect(addr1).approve(buzzTokens.address, ethers.utils.parseEther('1000'));

        await buzzTokens.connect(addr1).buyTokens(owner.address, 100);
        await buzzTokens.transferToContract(owner.address, addr1.address, addr2.address, 50);

        expect(await buzzTokens.tokensBalance(owner.address, addr1.address)).to.equal(50);
        expect(await buzzTokens.tokensBalance(owner.address, addr2.address)).to.equal(50);
      });

      it('Should transfer tokens from contract', async function () {
        await buzzTokens.setProtocolFeePercent(100); // 0.1%
        await buzzTokens.setCreatorFeePercent(200); // 0.2%

        await eth20.mint(addr1.address, ethers.utils.parseEther('1000'));
        await eth20.connect(addr1).approve(buzzTokens.address, ethers.utils.parseEther('1000'));

        await buzzTokens.connect(addr1).buyTokens(owner.address, 100);
        await buzzTokens.transferToContract(owner.address, addr1.address, addr2.address, 50);
        await buzzTokens.transerFromContract(owner.address, addr1.address, addr2.address, 50);

        expect(await buzzTokens.tokensBalance(owner.address, addr1.address)).to.equal(100);
        expect(await buzzTokens.tokensBalance(owner.address, addr2.address)).to.equal(0);
      });
    });
  });
})();
