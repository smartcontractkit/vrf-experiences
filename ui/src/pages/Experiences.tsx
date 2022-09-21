import React, { useMemo, useState } from "react";
import Button from "../components/Button/Button";
import Paragraph from "../components/Paragraph/Paragraph";
import TextInput from "../components/TextInput/TextInput";
import { Contracts, CONTRACT_REGISTRY, vrfRaffleInterface } from "../constants";
import { TmcnftAbi__factory } from "../types";
import { ethers } from "ethers";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { VrfRaffleAbi__factory } from "../types/factories/VrfRaffleAbi__factory";
import { proofs } from "../merkleTree.json";

interface ExperiencesProps {
  signer: ethers.providers.JsonRpcSigner;
}

type ProofMap = { [hashedTicketConfirmationNumber: string]: string[] };

export default function Experiences(props: ExperiencesProps) {
  const [ticketConfirmationNumber, setTicketConfirmationNumber] = useState<string>();
  const [isClaimYourSpotDisabled, setIsClaimYourSpotDisabled] = useState(false);
  const [isEnterRaffleDisabled, setIsEnterRaffleDisabled] = useState(false);

  const tmcNftSpec = CONTRACT_REGISTRY[Contracts.TMCNFT];
  const vrfRaffleSpec = CONTRACT_REGISTRY[Contracts.Raffle];
  const tmcnft = useMemo(() => TmcnftAbi__factory.connect(tmcNftSpec.address, props.signer), [tmcNftSpec.address, props.signer]);
  const vrfRaffle = useMemo(() => VrfRaffleAbi__factory.connect(vrfRaffleSpec.address, props.signer), [vrfRaffleSpec.address, props.signer]);

  const claimYourSpot = async () => {
    const tx = await tmcnft.claimYourSpot();
    setIsClaimYourSpotDisabled(true);
    await tx.wait();
    setIsClaimYourSpotDisabled(false);
  };

  const enterRaffle = async () => {
    if (!ticketConfirmationNumber) {
      alert("Enter valid ticket confirmation number");
      return;
    }
    const hashedTicketConfirmationNumber = keccak256(toUtf8Bytes(ticketConfirmationNumber.toUpperCase()));

    try {
      const proofMap: ProofMap = proofs;
      const proof: string[] = proofMap[hashedTicketConfirmationNumber];

      if (!proof) {
        alert("Invalid ticket number");
      } else {
        const tx = await vrfRaffle.enterRaffle(hashedTicketConfirmationNumber, proof);
        setIsEnterRaffleDisabled(true);
        await tx.wait();
        setIsEnterRaffleDisabled(false);
      }
    } catch (error: any) {
      const errorMessage = vrfRaffleInterface.parseError(error.error.data.originalError.data);

      if (errorMessage.name === "AlreadyEntered") {
        alert("This ticket number is already registered for the raffle");
      } else if (errorMessage.name === "InvalidTicket") {
        alert("Invalid ticket number");
      } else {
        alert(errorMessage.name);
      }
    }
  };

  return (
    <>
      <h1 className="heading-one">The Largest</h1>
      <h1 className="heading-one">Collaborative NFT</h1>
      <div className="content-container" style={{ paddingTop: isClaimYourSpotDisabled ? 0 : 50 }}>
        {isClaimYourSpotDisabled && <Paragraph text="Submitting transaction..."></Paragraph>}
        <Button text="Claim Your Spot" onClick={() => claimYourSpot()} isDisabled={isClaimYourSpotDisabled} />
      </div>

      <hr style={{ marginTop: 70, marginBottom: 50 }} />

      <h1 className="heading-one">VRF Raffle</h1>
      <div className="content-container">
        {isEnterRaffleDisabled ? (
          <Paragraph text="Submitting transaction..."></Paragraph>
        ) : (
          <TextInput value={ticketConfirmationNumber} placeholder={"Ticket confirmation number"} onChange={setTicketConfirmationNumber}></TextInput>
        )}
        <Button text="Enter raffle" onClick={() => enterRaffle()} isDisabled={isEnterRaffleDisabled} />
      </div>
    </>
  );
}
