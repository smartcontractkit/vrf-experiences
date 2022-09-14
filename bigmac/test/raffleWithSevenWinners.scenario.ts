import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, constants, ContractReceipt, ContractTransaction } from "ethers";
import { BytesLike, parseEther } from "ethers/lib/utils";
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

    const mockParticipants: BytesLike[] = [
      `0x641b11da408590705534ed5490f73a3b2a67b5a863e46bc5d91322f67eea15ef`,
      `0xa19feb02fec238cf38a8b3c705f86a9e5459257a9a41e25dd8ebbcb0c6aaab6e`,
      `0xc2296d861dba29a8cbc07c736692f2cd6c4a24ee7a9b4528a338271769c86c79`,
      `0x8988f55288729a137e5003981a56db0c5eb2a400be05c87501ea16107642b175`,
      `0xc120b4d20493030bfca3b5d1f85287dc2715e87e40ad0ecfaa87241cf4412a74`,
      `0x2aaa45affb34e5ccdfece5ca9dff4dd3014a5651f9b44123489b12dcad83d2ac`,
      `0x29687b53a1814b9496b7a141660054c835c0324e4f0851e849e5aa6c640357ee`,
      `0xab6c0333b6544caece6087ee699940b1cb3c6b1b696690dbdfc45c92e23fc414`,
      `0x3c023a5081ae97fb4fa214d233e4831c61168b41be5bb6c1131e42fbb29622ec`,
      `0x58bc086d6c0abed01c03e3d7d5489289035ad9afa7d496f4d3fdc5d0216e2279`,
      `0x4121e62e50c9b6345f60f9647274947689c2f1450d413010531061d303082724`,
      `0x680e9ac1b62d2ad60a81cbc5432a924345ff0a1512286411bbc6a7734578169a`,
    ];

    const bigMacRaffleFactory = await ethers.getContractFactory(`BigMacRaffle`);
    const bigMacRaffle: BigMacRaffle = (await bigMacRaffleFactory.deploy(
      mockParticipants,
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
      if (!transactionReceipt.events[1].args) return;
      const requestId = transactionReceipt.events[1].args[0];

      await mockVrfCoordinator.fulfillRandomWords(requestId, bigMacRaffle.address);
      await triggerPromise;
      await expect(bigMacRaffle.connect(owner).runRaffle()).to.be.revertedWithCustomError(bigMacRaffle, `RaffleCanBeRunOnlyOnce`);
    });

    it("should draw additional winners if someone is unable to attend", async function () {
      const numberOfAdditionalWinners = 4;

      const transaction: ContractTransaction = await bigMacRaffle.connect(owner).drawAdditionalWinners(numberOfAdditionalWinners);
      const transactionReceipt: ContractReceipt = await transaction.wait(1);
      if (!transactionReceipt.events) return;
      if (!transactionReceipt.events[1].args) return;
      const requestId = transactionReceipt.events[1].args[0];

      await mockVrfCoordinator.fulfillRandomWords(requestId, bigMacRaffle.address);
      const winners = await bigMacRaffle.getWinners();

      assert(winners.length === numberOfAdditionalWinners, "Invalid winners number");
    });
  });
});
