import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert } from "chai";
import { ContractTransaction, ContractReceipt, constants } from "ethers";
import { keccak256, parseEther, toUtf8Bytes } from "ethers/lib/utils";
import { ethers } from "hardhat";
import MerkleTree from "merkletreejs";
import { VRFCoordinatorV2Mock, VrfRaffle, VrfRaffle__factory } from "../../typechain-types";
import { generateMerkleTree } from "../shared/generateMerkleTree";

describe("Vrf Raffle scenario with two and two winners", async function () {
  async function deployVrfRaffleFixture() {
    const [deployer, keepersRegistry, user] = await ethers.getSigners();

    /**
     * @dev Read more at https://docs.chain.link/docs/chainlink-vrf/
     */
    const BASE_FEE = "100000000000000000";
    const GAS_PRICE_LINK = "1000000000"; // 0.000000001 LINK per gas

    const vrfCoordinatorFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    const vrfCoordinator: VRFCoordinatorV2Mock = await vrfCoordinatorFactory.deploy(BASE_FEE, GAS_PRICE_LINK);

    const transaction: ContractTransaction = await vrfCoordinator.createSubscription();
    const transactionReceipt: ContractReceipt = await transaction.wait(1);
    if (!transactionReceipt.events) return;
    const subscriptionId = ethers.BigNumber.from(transactionReceipt.events[0].topics[1]);

    const keyHash = "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
    const callbackGasLimit = 2500000;
    const requestConfirmations = 5;
    const numWords = 2;
    const vrfRaffleFactory: VrfRaffle__factory = await ethers.getContractFactory("VrfRaffle");

    if (!process.env.TICKET_CONFIRMATION_NUMBERS) return;
    const ticketConfirmationNumbers: string[] = JSON.parse(process.env.TICKET_CONFIRMATION_NUMBERS);
    const { merkleRoot, merkleTree } = await generateMerkleTree(ticketConfirmationNumbers);

    const vrfRaffle: VrfRaffle = await vrfRaffleFactory.deploy(
      subscriptionId,
      vrfCoordinator.address,
      keyHash,
      callbackGasLimit,
      requestConfirmations,
      numWords,
      deployer.address,
      constants.AddressZero,
      keepersRegistry.address,
      merkleRoot
    );

    await vrfCoordinator.addConsumer(subscriptionId, vrfRaffle.address);
    const fundAmount = parseEther("5");
    await vrfCoordinator.fundSubscription(subscriptionId, fundAmount);

    return { vrfRaffle, vrfCoordinator, keepersRegistry, user, ticketConfirmationNumbers, merkleTree, numWords };
  }

  let vrfRaffle: VrfRaffle;
  let vrfCoordinator: VRFCoordinatorV2Mock;
  let keepersRegistry: SignerWithAddress;
  let user: SignerWithAddress;
  let ticketConfirmationNumbers: string[];
  let merkleTree: MerkleTree;
  let numberOfWinners: number;

  beforeEach(async function () {
    const fixture = await loadFixture(deployVrfRaffleFixture);
    if (!fixture) return;
    vrfRaffle = fixture.vrfRaffle;
    vrfCoordinator = fixture.vrfCoordinator;
    keepersRegistry = fixture.keepersRegistry;
    user = fixture.user;
    ticketConfirmationNumbers = fixture.ticketConfirmationNumbers;
    merkleTree = fixture.merkleTree;
    numberOfWinners = fixture.numWords;
  });

  async function prepareScenario(): Promise<void> {
    ticketConfirmationNumbers.forEach(async function (ticketConfirmationNumber) {
      const hashedTicketConfirmationNumber = keccak256(toUtf8Bytes(ticketConfirmationNumber));
      const proof = merkleTree.getHexProof(hashedTicketConfirmationNumber);
      await vrfRaffle.connect(user).enterRaffle(hashedTicketConfirmationNumber, proof);
    });
  }

  it("should run raffle and determine winners", async function () {
    await prepareScenario();

    const participantsBefore = await vrfRaffle.getParticipants();

    // first raffle
    const firstTransaction: ContractTransaction = await vrfRaffle.connect(keepersRegistry).requestRandomWords();
    const firstTransactionReceipt: ContractReceipt = await firstTransaction.wait(1);
    if (!firstTransactionReceipt.events) return;
    if (!firstTransactionReceipt.events[1].args) return;
    const firstRequestId = firstTransactionReceipt.events[1].args[0];

    await vrfCoordinator.fulfillRandomWords(firstRequestId, vrfRaffle.address);

    const winnersAfterFirstRaffle = await vrfRaffle.getWinners();
    assert(winnersAfterFirstRaffle.length === numberOfWinners, "Invalid winners number");

    const participantsAfterFirstRaffle = await vrfRaffle.getParticipants();
    assert(participantsAfterFirstRaffle.length === participantsBefore.length - numberOfWinners, "Participants set cleanup failed after first raffle");

    // second raffle
    const secondTransaction: ContractTransaction = await vrfRaffle.connect(keepersRegistry).requestRandomWords();
    const secondTransactionReceipt: ContractReceipt = await secondTransaction.wait(1);
    if (!secondTransactionReceipt.events) return;
    if (!secondTransactionReceipt.events[1].args) return;
    const secondRequestId = secondTransactionReceipt.events[1].args[0];

    await vrfCoordinator.fulfillRandomWords(secondRequestId, vrfRaffle.address);

    const winnersAfterSecondRaffle = await vrfRaffle.getWinners();
    assert(winnersAfterSecondRaffle.length === winnersAfterFirstRaffle.length + numberOfWinners, "Invalid winners number");

    const participantsAfterSecondRaffle = await vrfRaffle.getParticipants();
    assert(participantsAfterSecondRaffle.length === participantsAfterFirstRaffle.length - numberOfWinners, "Participants set cleanup failed");
  });
});
