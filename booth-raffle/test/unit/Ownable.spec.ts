import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";
import { Ownable } from "../../typechain-types";

describe("Ownable Unit Tests", async function () {
  async function deployOwnableUnitFixture() {
    const [deployer, user] = await ethers.getSigners();

    const ownableFactory = await ethers.getContractFactory("OwnableMock");
    const ownable: Ownable = await ownableFactory.deploy(deployer.address, constants.AddressZero);

    return { ownable, deployer, user };
  }

  let ownable: Ownable;
  let owner: SignerWithAddress;
  let newOwner: SignerWithAddress;

  const testsToSkipBeforeEach = [
    "should trigger _transferOwnership if pendingOwner is not address zero",
    "should revert if address zero is provided in the constructor as newOwner",
  ];

  beforeEach(async function () {
    if (this.currentTest) {
      if (testsToSkipBeforeEach.includes(this.currentTest.title)) return;
    }
    const fixture = await loadFixture(deployOwnableUnitFixture);
    ownable = fixture.ownable;
    owner = fixture.deployer;
    newOwner = fixture.user;
  });

  describe("Deployment", async function () {
    describe("success", async function () {
      it("should set the owner storage variable", async function () {
        const ownerAddress = await ownable.owner();
        assert(ownerAddress === owner.address, "Owner addresses missmatch");
      });

      it("should trigger _transferOwnership if pendingOwner is not address zero", async function () {
        const [newOwner, pendingOwner] = await ethers.getSigners();
        const ownableFactory = await ethers.getContractFactory("OwnableMock");
        expect((ownable = await ownableFactory.connect(newOwner).deploy(newOwner.address, pendingOwner.address)))
          .to.emit(ownable, "OwnershipTransferRequested")
          .withArgs(newOwner.address, pendingOwner.address);
      });
    });

    describe("failure", async function () {
      it("should revert if address zero is provided in the constructor as newOwner", async function () {
        const ownableFactory = await ethers.getContractFactory("OwnableMock");
        await expect(ownableFactory.deploy(constants.AddressZero, constants.AddressZero)).to.be.revertedWithCustomError(
          ownable,
          "CannotSetOwnerToZeroAddress"
        );
      });
    });
  });

  describe("#transferOwnership", async function () {
    describe("success", async function () {
      it("should be callable by owner", async function () {
        await expect(ownable.connect(owner).transferOwnership(newOwner.address)).to.not.be.reverted;
      });

      it("should set pending owner address", async function () {
        await ownable.connect(owner).transferOwnership(newOwner.address);
        const pendingOwnerAddress = await ownable.getPendingOwner();
        assert(newOwner.address === pendingOwnerAddress, "Pending Owner address missmatch");
      });

      it("should emit proper event", async function () {
        expect(await ownable.connect(owner).transferOwnership(newOwner.address))
          .to.emit(ownable, "OwnershipTransferRequested")
          .withArgs(owner.address, newOwner.address);
      });
    });

    describe("failure", async function () {
      it("should revert if caller is not an owner", async function () {
        await expect(ownable.connect(newOwner).transferOwnership(newOwner.address)).to.be.revertedWithCustomError(ownable, "CallerIsNotOwner");
      });

      it("should revert if address of a new address is zero", async function () {
        await expect(ownable.connect(owner).transferOwnership(constants.AddressZero)).to.be.revertedWithCustomError(
          ownable,
          "CannotSetOwnerToZeroAddress"
        );
      });

      it("should revert if new owner is owner", async function () {
        await expect(ownable.connect(owner).transferOwnership(owner.address)).to.be.revertedWithCustomError(ownable, "CannotTransferToSelf");
      });
    });
  });

  describe("#acceptOwnership", async function () {
    async function prepare(): Promise<void> {
      await ownable.connect(owner).transferOwnership(newOwner.address);
    }

    describe("success", async function () {
      it("should transfer ownership", async function () {
        await prepare();
        await ownable.connect(newOwner).acceptOwnership();
        const ownerAddress = await ownable.owner();
        const pendingOwnerAddress = await ownable.getPendingOwner();

        assert(ownerAddress === newOwner.address, "Owner not set correctly");
        assert(pendingOwnerAddress === constants.AddressZero, "Pending owner address is not zero");
      });

      it("should emit proper event", async function () {
        await prepare();
        expect(await ownable.connect(newOwner).acceptOwnership())
          .to.emit(ownable, "OwnershipTransferred")
          .withArgs(owner.address, newOwner.address);
      });
    });

    describe("failure", async function () {
      it("should revert if pending owner is not a caller", async function () {
        await prepare();
        await expect(ownable.connect(owner).acceptOwnership()).to.be.revertedWithCustomError(ownable, "MustBeProposedOwner");
      });
    });
  });

  describe("#cancelOwnershipTransfer", async function () {
    async function prepare(): Promise<void> {
      await ownable.connect(owner).transferOwnership(newOwner.address);
    }

    describe("success", async function () {
      it("should cancel ownership transfer", async function () {
        await prepare();
        await ownable.connect(owner).cancelOwnershipTransfer();
        const pendingOwnerAddress = await ownable.getPendingOwner();

        assert(pendingOwnerAddress === constants.AddressZero, "Pending owner address is not set to zero");
      });

      it("should emit proper event", async function () {
        await prepare();
        expect(await ownable.connect(owner).cancelOwnershipTransfer())
          .to.emit(ownable, "OwnershipTransferCanceled")
          .withArgs(owner.address, newOwner.address);
      });
    });

    describe("failure", async function () {
      it("should revert if caller is not an owner", async function () {
        await prepare();
        await expect(ownable.connect(newOwner).cancelOwnershipTransfer()).to.be.revertedWithCustomError(ownable, "CallerIsNotOwner");
      });
    });
  });
});
