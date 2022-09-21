import { constants } from "ethers";
import { ethers, network, run } from "hardhat";
import { VrfRaffle, VrfRaffle__factory } from "../typechain-types";
import { merkleRoot } from '../merkleTree.json'

async function main() {
  const subscriptionId = process.env.SUBSCRIPTION_ID;
  if (!subscriptionId) return;
  const vrfCoordinator = `0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D`;
  const keyHash = `0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15`;
  const callbackGasLimit = 2500000;
  const requestConfirmations = 5;
  const numWords = 4;
  const owner = `0x8fDEA7A82D7861144D027e4eb2acCCf4eB37bb05`;
  const keepersRegistry = `0x02777053d6764996e594c3E88AF1D58D5363a2e6`

  const vrfRaffleFactory: VrfRaffle__factory = await ethers.getContractFactory('VrfRaffle');
  const vrfRaffle: VrfRaffle = await vrfRaffleFactory.deploy(subscriptionId, vrfCoordinator, keyHash, callbackGasLimit, requestConfirmations, numWords, owner, constants.AddressZero, keepersRegistry, merkleRoot)

  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await vrfRaffle.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

  console.log(`VRF Raffle deployed on ${network.name} to ${vrfRaffle.address}`);

  console.log(`Verifying contract on Etherscan...`);
  await run(`verify:verify`, {
    address: vrfRaffle.address,
    constructorArguments: [subscriptionId, vrfCoordinator, keyHash, callbackGasLimit, requestConfirmations, numWords, owner, constants.AddressZero, keepersRegistry, merkleRoot],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
