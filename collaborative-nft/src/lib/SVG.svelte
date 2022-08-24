<script>
	import { ethers } from 'ethers';
	import SPOTSAbi from '../contracts/SPOTS.json';
	const contractAddr = import.meta.env.VITE_CONTRACT_ADDRESS;
	$: image = '';
	// const url = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
	const url = 'https://api.avax-test.network/ext/bc/C/rpc';
	var provider = new ethers.providers.JsonRpcProvider(url);
	const contract = new ethers.Contract(contractAddr, SPOTSAbi.abi, provider);
	async function getSVG() {
		image = await contract.getSVG();
	}
	async function ethListen() {
		contract.on('SpotClaimed', async () => {
			getSVG();
		});
	}
	ethListen();
	getSVG();
</script>

<img src={image} alt="The NFT" class="w-full h-auto shadow-primary border-accent border-2" />

<style>
	img {
		box-shadow: 7px 7px #00ff99;
	}
</style>
