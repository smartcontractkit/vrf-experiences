import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, constants, ContractReceipt, ContractTransaction } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, network } from "hardhat";
import { BigMacRaffle, VRFCoordinatorV2Mock } from "../typechain-types";

describe(`BigMac Raffle test scenario with seven winners on Goerli testnet`, async function () {
  async function deployBigMacRaffleFixture() {
    const [deployer] = await ethers.getSigners();

    /**
     * @dev Read more at https://docs.chain.link/docs/chainlink-vrf/
     */
    const BASE_FEE = "100000000000000000";
    const GAS_PRICE_LINK = "1000000000"; // 0.000000001 LINK per gas

    const vrfCoordinatorFactory = await ethers.getContractFactory(`VRFCoordinatorV2Mock`);
    const mockVrfCoordinator: VRFCoordinatorV2Mock = await vrfCoordinatorFactory.deploy(BASE_FEE, GAS_PRICE_LINK);

    const transaction: ContractTransaction = await mockVrfCoordinator.createSubscription();
    const transactionReceipt: ContractReceipt = await transaction.wait(1);
    if (!transactionReceipt.events) return;
    const subscriptionId = ethers.BigNumber.from(transactionReceipt.events[0].topics[1]);

    const keyHash = `0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15`;
    const callbackGasLimit = 2500000;
    const requestConfirmations = 5;
    const numWords = 7;

    const bigMacRaffleFactory = await ethers.getContractFactory(`BigMacRaffle`);
    const bigMacRaffle: BigMacRaffle = (await bigMacRaffleFactory.deploy(
      subscriptionId,
      mockVrfCoordinator.address,
      keyHash,
      callbackGasLimit,
      requestConfirmations,
      numWords,
      deployer.address,
      constants.AddressZero
    )) as BigMacRaffle;

    mockVrfCoordinator.addConsumer(subscriptionId, bigMacRaffle.address);
    mockVrfCoordinator.fundSubscription(subscriptionId, parseEther("5"));

    return { bigMacRaffle, deployer, numWords, mockVrfCoordinator };
  }

  let bigMacRaffle: BigMacRaffle;
  let owner: SignerWithAddress;
  let numberOfWinners: number;
  let mockVrfCoordinator: VRFCoordinatorV2Mock;

  beforeEach(async function () {
    const fixture = await loadFixture(deployBigMacRaffleFixture);
    if (!fixture) return;
    bigMacRaffle = fixture.bigMacRaffle;
    owner = fixture.deployer;
    numberOfWinners = fixture.numWords;
    mockVrfCoordinator = fixture.mockVrfCoordinator;
  });

  describe("Running raffle scenario", async function () {
    it("should run raffle and determine seven winners only once", async function () {
      const triggerPromise = new Promise((resolve, reject) => {
        bigMacRaffle.once(`RaffleEnded`, async function () {
          const winners = await bigMacRaffle.getWinners();

          resolve(assert(winners.length === numberOfWinners, "Invalid winners number"));
        });
      });

      const transaction: ContractTransaction = await bigMacRaffle.connect(owner).runRaffle();
      const transactionReceipt: ContractReceipt = await transaction.wait(1);
      if (!transactionReceipt.events) return;
      const requestId = transactionReceipt.events[0].topics[2];

      await mockVrfCoordinator.fulfillRandomWords(requestId, bigMacRaffle.address);
      await triggerPromise;
      await expect(bigMacRaffle.connect(owner).runRaffle()).to.be.revertedWithCustomError(bigMacRaffle, `RaffleCanBeRunOnlyOnce`);
    });
  });
});
