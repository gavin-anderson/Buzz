const { Contract, ContractFactory, utils } = require("ethers");
const { waffle } = require("hardhat");


async function main() {
    const [funder, recipient1, recipient2] = await ethers.getSigners();
    const provider = waffle.provider;
    const faucetAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    console.log("Faucet Funded");
    console.log(`Faucet Balance: ${ethers.utils.formatEther(await provider.getBalance(faucetAddress))} ETH`);
    console.log(`Funder Balance: ${ethers.utils.formatEther(await funder.getBalance())} ETH`);
    console.log(`Recipient1 Balance: ${ethers.utils.formatEther(await recipient1.getBalance())} ETH`);
    console.log(`Recipient2 Balance: ${ethers.utils.formatEther(await recipient2.getBalance())} ETH`);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });