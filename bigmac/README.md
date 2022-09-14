# Big Mac Raffle 🍔

The contract to determine winners of BigMac lunch with Sergey Nazarov at SmartCon 2022 powered by Chainlink VRF.

## Previous Raffles

|     Event     | Transaction Hash |
| :-----------: | :--------------: |
| SmartCon 2022 |                  |

## Running Locally

### Prerequisites

Be sure to have installed the following

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)

### Build and Deploy

1. Clone project

```shell
git clone https://github.com/smartcontractkit/vrf-experiences.git && cd bigmac
```

2. Install packages

```shell
yarn
```

3. Compile contracts

```shell
yarn compile
```

4. Run tests

```shell
yarn test
```

5. Deploy contract

Fund your wallet with tesnet tokens from the [Chainlink Faucet](https://faucets.chain.link).

Navigate to the [VRF Subscription Managment Page](https://vrf.chain.link). Connect your wallet. Create new VRF Subscription and save Subscription ID. Fund Subscription. We will add consumer contract later.

Copy the `.env.example` file to a file named `.env`, and put your VRF Subscription ID, Private Key, [Alchemy key](https://alchemy.com/?r=08af1111-db8b-4c0c-8312-fd9737680f98) and [Etherscan API Key](https://etherscan.io/apis) like this

```shell
GOERLI_RPC_URL=https://eth-goerli.g.alchemyapi.com/v2/<YOUR ALCHEMY KEY>
SUBSCRIPTION_ID=777
ETHERSCAN_API_KEY=ABC123ABC123ABC123ABC123ABC123ABC1
PRIVATE_KEY=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1
```

Run the deployment script which will also verify your smart contract on Etherscan.

```shell
yarn deploy
```

Go back to the [VRF Subscription Managment Page](https://vrf.chain.link), find your Subscription, and add recently deployed contract's address as new Consumer.
