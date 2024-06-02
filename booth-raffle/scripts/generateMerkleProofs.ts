import { generateMerkleTree } from "../test/shared/generateMerkleTree";
import { writeFile } from 'fs'
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";

type ProofMap = { [hashedTicketConfirmationNumber: string]: string[] };

async function main() {
    if (!process.env.TICKET_CONFIRMATION_NUMBERS) return;
    const ticketConfirmationNumbers: string[] = JSON.parse(process.env.TICKET_CONFIRMATION_NUMBERS);
    const { merkleRoot, merkleTree } = await generateMerkleTree(ticketConfirmationNumbers);

    let proofs: ProofMap = {};

    ticketConfirmationNumbers.forEach(ticketConfirmationNumber => {
        const hashedTicketConfirmationNumber = keccak256(toUtf8Bytes(ticketConfirmationNumber));
        const proof = merkleTree.getHexProof(hashedTicketConfirmationNumber);
        proofs[hashedTicketConfirmationNumber] = proof;
    })

    const generated = {
        merkleRoot: merkleRoot,
        merkleTree: merkleTree,
        proofs: proofs
    }

    writeFile('merkleTree.json', JSON.stringify(generated), 'utf8', (err) => { if (err) console.error(err) })
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});