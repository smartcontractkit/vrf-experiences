import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { VRFCoordinatorV2Mock, VrfRaffle, VrfRaffle__factory } from "../../typechain-types";
import { BigNumber, constants, ContractReceipt, ContractTransaction } from "ethers";
import { keccak256, parseEther, toUtf8Bytes } from "ethers/lib/utils";
import { deployMockOwnable } from "../shared/mocks";
import { MockContract } from "@ethereum-waffle/mock-contract";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { generateMerkleTree } from "../shared/generateMerkleTree";
import MerkleTree from "merkletreejs";

describe("VrfRaffle Unit Tests", function () {
  async function deployVrfRaffleUnitFixture() {
    const [deployer, keepersRegistry, user] = await ethers.getSigners();

    /**
     * @dev Read more at https://docs.chain.link/docs/chainlink-vrf/
     */
    const BASE_FEE = "100000000000000000";
    const GAS_PRICE_LINK = "1000000000"; // 0.000000001 LINK per gas

    const mockVrfCoordinatorFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    const mockVrfCoordinator: VRFCoordinatorV2Mock = await mockVrfCoordinatorFactory.deploy(BASE_FEE, GAS_PRICE_LINK);

    const transaction: ContractTransaction = await mockVrfCoordinator.createSubscription();
    const transactionReceipt: ContractReceipt = await transaction.wait(1);
    if (!transactionReceipt.events) return;
    const subscriptionId = ethers.BigNumber.from(transactionReceipt.events[0].topics[1]);

    const keyHash = "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
    const callbackGasLimit = 2500000;
    const requestConfirmations = 5;
    const numWords = 4;
    const vrfRaffleFactory: VrfRaffle__factory = await ethers.getContractFactory("VrfRaffle");

    const ticketNumbers = ["123ABC", "111AAA", "222BBB", "333CCC"];
    const { merkleRoot, merkleTree } = await generateMerkleTree(ticketNumbers);

    const vrfRaffle: VrfRaffle = await vrfRaffleFactory.deploy(
      subscriptionId,
      mockVrfCoordinator.address,
      keyHash,
      callbackGasLimit,
      requestConfirmations,
      numWords,
      deployer.address,
      constants.AddressZero,
      keepersRegistry.address,
      merkleRoot
    );

    await mockVrfCoordinator.addConsumer(subscriptionId, vrfRaffle.address);
    const fundAmount = parseEther("5");
    await mockVrfCoordinator.fundSubscription(subscriptionId, fundAmount);

    const mockOwnable = await deployMockOwnable(deployer);

    return { vrfRaffle, mockVrfCoordinator, mockOwnable, deployer, keepersRegistry, user, subscriptionId, merkleTree, ticketNumbers };
  }

  let vrfRaffle: VrfRaffle;
  let mockVrfCoordinator: VRFCoordinatorV2Mock;
  let mockOwnable: MockContract;
  let owner: SignerWithAddress;
  let mockKeepersRegistry: SignerWithAddress;
  let user: SignerWithAddress;
  let merkleTree: MerkleTree;
  let ticketNumbers: string[];

  beforeEach(async function () {
    const fixture = await loadFixture(deployVrfRaffleUnitFixture);
    if (!fixture) return;
    vrfRaffle = fixture.vrfRaffle;
    mockVrfCoordinator = fixture.mockVrfCoordinator;
    mockOwnable = fixture.mockOwnable;
    owner = fixture.deployer;
    mockKeepersRegistry = fixture.keepersRegistry;
    user = fixture.user;
    merkleTree = fixture.merkleTree;
    ticketNumbers = fixture.ticketNumbers;
  });

  context("Client side hashing", function () {
    describe("#getHashedTicketConfirmationNumber", async function () {
      it("should produce the keccak256 hash of confirmation ticket number as ethers' keccak256()", async function () {
        const mockTicketConfirmationNumber = "ABC123";

        const hashFromContract = await vrfRaffle.getHashedTicketConfirmationNumber(mockTicketConfirmationNumber);
        const hashFromEthers = keccak256(toUtf8Bytes(mockTicketConfirmationNumber));

        assert.equal(hashFromContract, hashFromEthers);
      });
    });
  });

  describe("#setNumWords", async function () {
    describe("success", async function () {
      const newNumWords = 2;

      it("should set num words", async function () {
        // mockOwnable.mock.onlyOwner.returns(true);
        await vrfRaffle.setNumWords(newNumWords);
        const numWords = await vrfRaffle.getNumWords();
        assert(numWords === newNumWords, "newNumWords not set properly");
      });

      it("should emit proper event", async function () {
        expect(await vrfRaffle.setNumWords(newNumWords))
          .to.emit(vrfRaffle, "NumWordsUpdated")
          .withArgs(newNumWords);
      });
    });

    describe("failure", async function () {
      const newNumWords = 2;

      it("should revert if caller is not an owner", async function () {
        await expect(vrfRaffle.connect(user).setNumWords(newNumWords)).to.be.revertedWithCustomError(vrfRaffle, "CallerIsNotOwner");
      });
    });
  });

  describe("#enterRaffle", async function () {
    const ticketNumber = ticketNumbers[0];

    describe("success", async function () {
      it("should allow user to enter the raffle with a valid ticket", async function () {
        const hashedTicketConfirmationNumber = keccak256(toUtf8Bytes(ticketNumber));
        const proof = merkleTree.getHexProof(hashedTicketConfirmationNumber);

        await vrfRaffle.connect(user).enterRaffle(hashedTicketConfirmationNumber, proof);

        const participants = await vrfRaffle.getParticipants();

        assert(participants[0] === hashedTicketConfirmationNumber, "Hasn't been added to the participants set");
      });

      it("should emit proper event", async function () {
        const hashedTicketConfirmationNumber = keccak256(toUtf8Bytes(ticketNumber));
        const proof = merkleTree.getHexProof(hashedTicketConfirmationNumber);

        expect(await vrfRaffle.connect(user).enterRaffle(hashedTicketConfirmationNumber, proof))
          .to.emit(vrfRaffle, "NewParticipant")
          .withArgs(hashedTicketConfirmationNumber);
      });
    });

    describe("failure", async function () {
      it("should revert if user entered invalid ticket number", async function () {
        const invalidTicketNumber = "111";
        const hashedTicketConfirmationNumber = keccak256(toUtf8Bytes(invalidTicketNumber));
        const proof = merkleTree.getHexProof(hashedTicketConfirmationNumber);

        await expect(vrfRaffle.connect(user).enterRaffle(hashedTicketConfirmationNumber, proof))
          .to.be.revertedWithCustomError(vrfRaffle, "InvalidTicket")
          .withArgs(hashedTicketConfirmationNumber);
      });

      it("should revert if already user entered valid ticket number", async function () {
        const hashedTicketConfirmationNumber = keccak256(toUtf8Bytes(ticketNumber));
        const proof = merkleTree.getHexProof(hashedTicketConfirmationNumber);

        await vrfRaffle.connect(user).enterRaffle(hashedTicketConfirmationNumber, proof);

        await expect(vrfRaffle.connect(user).enterRaffle(hashedTicketConfirmationNumber, proof))
          .to.be.revertedWithCustomError(vrfRaffle, "AlreadyEntered")
          .withArgs(hashedTicketConfirmationNumber);
      });

      it("should revert if user already won a raffle prize", async function () {
        const hashedTicketConfirmationNumber = keccak256(toUtf8Bytes(ticketNumber));
        const proof = merkleTree.getHexProof(hashedTicketConfirmationNumber);

        await vrfRaffle.connect(user).enterRaffle(hashedTicketConfirmationNumber, proof);

        const tx: ContractTransaction = await vrfRaffle.connect(mockKeepersRegistry).requestRandomWords();
        const txReceipt: ContractReceipt = await tx.wait();
        if (!txReceipt.events) return;
        if (!txReceipt.events[1].args) return;
        const requestId = txReceipt.events[1].args[0];
        mockVrfCoordinator.fulfillRandomWords(requestId, vrfRaffle.address);

        await expect(vrfRaffle.connect(user).enterRaffle(hashedTicketConfirmationNumber, proof))
          .to.be.revertedWithCustomError(vrfRaffle, "AlreadyEntered")
          .withArgs(hashedTicketConfirmationNumber);
      });
    });
  });

  describe("#requestRandomWords", async function () {
    describe("success", async function () {
      it("should be callable by owner", async function () {
        await expect(vrfRaffle.connect(owner).requestRandomWords()).to.not.be.reverted;
      });

      it("should be callable by keepers registry", async function () {
        await expect(vrfRaffle.connect(mockKeepersRegistry).requestRandomWords()).to.not.be.reverted;
      });

      it("should emit proper event", async function () {
        expect(await vrfRaffle.connect(owner).requestRandomWords()).to.emit(vrfRaffle, "RaffleStarted");
      });
    });

    describe("failure", async function () {
      it("should be callable only by owner or keepers registry", async function () {
        await expect(vrfRaffle.connect(user).requestRandomWords()).to.be.revertedWithCustomError(vrfRaffle, "CallerIsNotOwnerNorKeepersRegistry");
      });
    });
  });

  describe("#fullfillRandomWords", async function () {
    describe("success", async function () {
      async function prepare(): Promise<BigNumber | undefined> {
        ticketNumbers.forEach(async function (ticketNumber) {
          const hashedTicketConfirmationNumber = keccak256(toUtf8Bytes(ticketNumber));
          const proof = merkleTree.getHexProof(hashedTicketConfirmationNumber);
          await vrfRaffle.connect(user).enterRaffle(hashedTicketConfirmationNumber, proof);
        });

        const tx: ContractTransaction = await vrfRaffle.connect(mockKeepersRegistry).requestRandomWords();
        const txReceipt: ContractReceipt = await tx.wait();
        if (!txReceipt.events) return;
        if (!txReceipt.events[1].args) return;
        const requestId = txReceipt.events[1].args[0];
        return BigNumber.from(requestId);
      }

      it("should determine raffle winners", async function () {
        const requestId = await prepare();
        if (!requestId) return;
        await mockVrfCoordinator.fulfillRandomWords(requestId, vrfRaffle.address);

        const winners = await vrfRaffle.getWinners();
        const numberOfWinners = await vrfRaffle.getNumWords();

        assert(winners.length === numberOfWinners, "Winners array size and numWord missmatch");
      });

      it("should emit RaffleWinner event", async function () {
        const requestId = await prepare();
        if (!requestId) return;
        expect(await mockVrfCoordinator.fulfillRandomWords(requestId, vrfRaffle.address)).to.emit(vrfRaffle, "RaffleWinner");
      });

      it("should emit RaffleEnded event", async function () {
        const requestId = await prepare();
        if (!requestId) return;
        expect(await mockVrfCoordinator.fulfillRandomWords(requestId, vrfRaffle.address))
          .to.emit(vrfRaffle, "RaffleEnded")
          .withArgs(requestId);
      });
    });
  });
});
