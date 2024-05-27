const { ethers } = require('hardhat');

(async () => {
  const { expect } = await import('chai');

  describe('ETH20', function () {
    let ETH20, eth20, owner, addr1, addr2;

    beforeEach(async function () {
      // Get the ContractFactory and Signers here.
      ETH20 = await ethers.getContractFactory('ETH20');

      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

      // Deploy the contract
      eth20 = await ETH20.deploy("ETH20 Token", "ETH20");
      await eth20.deployed();
    });

    describe('Deployment', function () {
      it('Should set the right owner', async function () {
        expect(await eth20.owner()).to.equal(owner.address);
      });

      it('Should set the correct token name and symbol', async function () {
        expect(await eth20.name()).to.equal("ETH20 Token");
        expect(await eth20.symbol()).to.equal("ETH20");
      });
    });

    describe('Setters', function () {
      it('Should set the buzzTokens address', async function () {
        await eth20.setBuzzTokens(addr1.address);
        expect(await eth20.buzzTokens()).to.equal(addr1.address);
      });

      it('Should set the king address', async function () {
        await eth20.setKing(addr2.address);
        expect(await eth20.king()).to.equal(addr2.address);
      });
    });

    describe('Special Mint', function () {
      it('Should mint tokens to a special address', async function () {
        await eth20.specialMint(addr1.address);
        expect(await eth20.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther('2.5'));

        await expect(eth20.specialMint(addr1.address)).to.be.revertedWith("Already got ETH20");
      });
    });

    describe('Transfers', function () {
      beforeEach(async function () {
        await eth20.setBuzzTokens(owner.address);
      });

      it('Should transfer tokens from one address to another', async function () {
        await eth20.specialMint(addr1.address);
        await eth20.transferFrom(addr1.address, addr2.address, ethers.utils.parseEther('1.0'));
        expect(await eth20.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther('1.0'));
      });

      it('Should fail if non-buzzTokens address tries to transfer tokens', async function () {
        await eth20.specialMint(addr1.address);
        await expect(
          eth20.connect(addr1).transferFrom(addr1.address, addr2.address, ethers.utils.parseEther('1.0'))
        ).to.be.revertedWith("only BuzzTokens Contract ETH20");
      });
    });
  });
})();
