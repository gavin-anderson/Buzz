const { Contract, ContractFactory, utils } = require("ethers");
const { waffle } = require("hardhat");

const faucetArtifacts = require("../artifacts/contracts/Faucet.sol/Faucet.json");


async function main(){
    const[funder]= await ethers.getSigners();
    const provider = waffle.provider;

    faucetDeploy = new ContractFactory(faucetArtifacts.abi,faucetArtifacts.bytecode, funder);
    const faucetObject = await faucetDeploy.deploy();
    console.log("Faucet Deployed");
    console.log(faucetObject.address);

    await funder.sendTransaction({
        to:faucetObject.address,
        value:ethers.utils.parseEther("1000")
    });
    console.log("Faucet Funded");
    console.log(`Faucet Balance: ${ethers.utils.formatEther(await provider.getBalance(faucetObject.address))} ETH`);
    console.log(`Funder Balance: ${ethers.utils.formatEther(await funder.getBalance())} ETH`);
  



}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });