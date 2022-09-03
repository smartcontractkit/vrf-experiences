import { MockContract, deployMockContract } from "@ethereum-waffle/mock-contract";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts } from "hardhat";
import { Artifact } from "hardhat/types";

export async function deployMockOwnable(deployer: SignerWithAddress): Promise<MockContract> {
  const ownableArtifact: Artifact = await artifacts.readArtifact("Ownable");
  const mockOwnable: MockContract = await deployMockContract(deployer, ownableArtifact.abi);

  return mockOwnable;
}
