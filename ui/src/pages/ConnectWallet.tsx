import React from "react";
import Button from "../components/Button/Button";
import Link from "../components/Link/Link";
import Paragraph from "../components/Paragraph/Paragraph";
import Title from "../components/Title/Title";

interface ConnectWalletProps {
  connectWallet: Function;
}

export default function ConnectWallet(props: ConnectWalletProps) {
  const walletParagraph = `Your wallet lets you read your balance, send transactions and connect to applications on the Blockchain.`;
  const testnetParagraph = `VRF Exepriences are deployed to Goerli test network. Get free tokens from the Chainlink Faucet.`;
  const walletUri = "https://metamask.io";
  const faucetUri = "https:faucets.chain.link";

  return (
    <>
      <Title text="Do you have a wallet?"></Title>
      <Paragraph text={walletParagraph}></Paragraph>
      <Link text="Create wallet" url={walletUri}></Link>

      <Title text="Need test tokens?"></Title>
      <Paragraph text={testnetParagraph}></Paragraph>
      <Link text="Claim tokens" url={faucetUri}></Link>

      <div className="content-container">
        <Button text="Connect Wallet" onClick={() => props.connectWallet()} />
      </div>
    </>
  );
}
