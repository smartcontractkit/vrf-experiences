import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import ConnectWallet from "./ConnectWallet";
import Experiences from "./Experiences";
import "./HomePage.css";

export default function HomePage() {
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // publicly well known Infura key
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: "any",
    cacheProvider: false,
    providerOptions,
    theme: "dark",
  });

  useEffect(() => {
    const handleDisconnect = () => {
      setSigner(null);
    };

    if (provider) {
      provider.on("disconnect", handleDisconnect);
    }

    return () => {
      if (provider) {
        provider.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [provider]);

  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    setProvider(provider);

    const library = new ethers.providers.Web3Provider(provider, "any");
    const network = await library.getNetwork();

    if (network.chainId !== 5) {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }

    const signer = library.getSigner();
    setSigner(signer);
  };

  return <div className="home-page">{!signer ? <ConnectWallet connectWallet={connectWallet} /> : <Experiences signer={signer} />}</div>;
}
