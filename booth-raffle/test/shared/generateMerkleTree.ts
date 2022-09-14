import { BytesLike } from "ethers";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { MerkleTree } from "merkletreejs";

export async function generateMerkleTree(ticketNumbers: string[]): Promise<{ merkleRoot: BytesLike; merkleTree: MerkleTree }> {
  const leaves = ticketNumbers.map((ticketNumber) => keccak256(toUtf8Bytes(ticketNumber)));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = merkleTree.getHexRoot();

  return { merkleRoot: merkleRoot, merkleTree: merkleTree };
}
