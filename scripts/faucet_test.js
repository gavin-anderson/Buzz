const { Contract, ContractFactory, utils } = require("ethers");
const { waffle } = require("hardhat");

const faucetArtifacts = require("../artifacts/contracts/Faucet.sol/Faucet.json");


async function main(){
    const[funder, recipient1,recipient2]= await ethers.getSigners();
    const provider = waffle.provider;

    faucetDeploy = new ContractFactory(faucetArtifacts.abi,faucetArtifacts.bytecode, funder);
    const faucetObject = await faucetDeploy.deploy();
    console.log("Faucet Deployed");
    console.log(`Faucet Balance: ${ethers.utils.formatEther(await provider.getBalance(faucetObject.address))} ETH`);
    console.log(`Funder Balance: ${ethers.utils.formatEther(await funder.getBalance())} ETH`);
    console.log(`Recipient1 Balance: ${ethers.utils.formatEther(await recipient1.getBalance())} ETH`);
    console.log(`Recipient2 Balance: ${ethers.utils.formatEther(await recipient2.getBalance())} ETH`);
    console.log("-------------------------------------");

    await funder.sendTransaction({
        to:faucetObject.address,
        value:ethers.utils.parseEther("1000")
    });
    console.log("Faucet Funded");
    console.log(`Faucet Balance: ${ethers.utils.formatEther(await provider.getBalance(faucetObject.address))} ETH`);
    console.log(`Funder Balance: ${ethers.utils.formatEther(await funder.getBalance())} ETH`);
    console.log(`Recipient1 Balance: ${ethers.utils.formatEther(await recipient1.getBalance())} ETH`);
    console.log(`Recipient2 Balance: ${ethers.utils.formatEther(await recipient2.getBalance())} ETH`);
    console.log("-------------------------------------");


    // On a Ping
    const Faucet = new Contract(faucetObject.address, faucetArtifacts.abi,provider);
    await Faucet.connect(funder).requestEth(recipient1.address);
    await Faucet.connect(funder).requestEth(recipient2.address);

    console.log("Recipient's Funded");
    console.log(`Faucet Balance: ${ethers.utils.formatEther(await provider.getBalance(faucetObject.address))} ETH`);
    console.log(`Funder Balance: ${ethers.utils.formatEther(await funder.getBalance())} ETH`);
    console.log(`Recipient1 Balance: ${ethers.utils.formatEther(await recipient1.getBalance())} ETH`);
    console.log(`Recipient2 Balance: ${ethers.utils.formatEther(await recipient2.getBalance())} ETH`);
    console.log("-------------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });