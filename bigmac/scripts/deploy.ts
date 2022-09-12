import { ethers, network, run } from "hardhat";
import { BytesLike, constants } from "ethers";

async function main() {
  const subscriptionId = process.env.SUBSCRIPTION_ID;
  if (!subscriptionId) return;
  const vrfCoordinator = `0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D`;
  const keyHash = `0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15`;
  const callbackGasLimit = 2500000;
  const requestConfirmations = 5;
  const numWords = 7;
  const owner = `0x6c235B011b85B6b92a60401d235737a11e95B3CD`;

  const participants: BytesLike[] = [];

  const bigMacRaffleFactory = await ethers.getContractFactory(`BigMacRaffle`);
  const bigMacRaffle = await bigMacRaffleFactory.deploy(
    participants,
    subscriptionId,
    vrfCoordinator,
    keyHash,
    callbackGasLimit,
    requestConfirmations,
    numWords,
    owner,
    constants.AddressZero
  );

  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await bigMacRaffle.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

  console.log(`BigMac Raffle deployed on ${network.name} to ${bigMacRaffle.address}`);

  console.log(`Verifying contract on Etherscan...`);
  await run(`verify:verify`, {
    address: bigMacRaffle.address,
    constructorArguments: [subscriptionId, vrfCoordinator, keyHash, callbackGasLimit, requestConfirmations, numWords, owner, constants.AddressZero],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
