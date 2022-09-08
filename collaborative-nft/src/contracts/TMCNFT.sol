// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.10;

import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';

contract TLNFT is VRFConsumerBaseV2, ERC721, ERC721URIStorage {
	VRFCoordinatorV2Interface COORDINATOR;

	// Your subscription ID.
	uint64 s_subscriptionId;

	// Coordinator. For other networks,
	// see https://docs.chain.link/docs/vrf-contracts/#configurations
	address vrfCoordinator = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D; // Goerli
	// address vrfCoordinator = 0x2eD832Ba664535e5886b75D64C46EB9a228C2610; // Fuji

	// The gas lane to use, which specifies the maximum gas price to bump to.
	// For a list of available gas lanes on each network,
	// see https://docs.chain.link/docs/vrf-contracts/#configurations
	bytes32 keyHash = 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15; // Goerli
	// 0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61; // Fuji

	// Depends on the number of requested values that you want sent to the
	// fulfillRandomWords() function. Storing each word costs about 20,000 gas,
	// so 100,000 is a safe default for this example contract. Test and adjust
	// this limit based on the network that you select, the size of the request,
	// and the processing of the callback request in the fulfillRandomWords()
	// function.
	uint32 callbackGasLimit = 999999;

	// The default is 3, but you can set this higher.
	uint16 requestConfirmations = 3; // Goerli
	// uint16 requestConfirmations = 1; // Fuji

	// For this example, retrieve 2 random values in one request.
	// Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
	uint32 numWords = 2;

	uint256[] public s_randomWords;
	uint256 s_requestId;
	address s_owner;
	mapping(uint256 => address) public requestIdToAddress;
	uint256 public width = 1920;
	uint256 public height = 1080;
	string finalSVG;
	string headSVG =
		string(
			abi.encodePacked(
				"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ",
				Strings.toString(width),
				' ',
				Strings.toString(height),
				"' preserveAspectRatio='xMidYMid meet'>",
				"<rect width='",
				Strings.toString(width),
				"' height='",
				Strings.toString(height),
				"' fill='#1C1C1C' />"
			)
		);
	string tailSVG = '</svg>';
	string bodySVG = '';
	string lastShape = '';
	string[] colors = ['#3366FF', '#00FF93', '#FFFFFF'];

	event SpotClaimed(string notification);

	constructor(uint64 subscriptionId)
		VRFConsumerBaseV2(vrfCoordinator)
		ERC721('SmartCon22 Spots', 'SCS')
	{
		COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
		s_owner = msg.sender;
		s_subscriptionId = subscriptionId;
		_safeMint(s_owner, 0);
		string memory _finalSVG = string(abi.encodePacked(headSVG, bodySVG, tailSVG));
		finalSVG = _finalSVG;
		string memory json = Base64.encode(
			bytes(
				string(
					abi.encodePacked(
						'{"name": "The Most Collaborative NFT",',
						'"description": "The Most Collaborative NFT for SmartCon 2022",',
						'"image": "data:image/svg+xml;base64,',
						Base64.encode(bytes(_finalSVG)),
						'"}'
					)
				)
			)
		);
		string memory finalTokenURI = string(
			abi.encodePacked('data:application/json;base64,', json)
		);
		_setTokenURI(0, finalTokenURI);
	}

	function callRandomWords(uint256 _val, uint256 _val2) public onlyOwner {
		uint256[] memory _randWords = new uint256[](2);
		_randWords[0] = _val;
		_randWords[1] = _val2;
		fulfillRandomWords(123, _randWords);
	}

	// Assumes the subscription is funded sufficiently.
	function claimYourSpot() public {
		// Will revert if subscription is not set and funded.
		s_requestId = COORDINATOR.requestRandomWords(
			keyHash,
			s_subscriptionId,
			requestConfirmations,
			callbackGasLimit,
			numWords
		);
	}

	function getSVG() public view returns (string memory SVG) {
		return
			string(abi.encodePacked('data:image/svg+xml;base64,', Base64.encode(bytes(finalSVG))));
	}

	function fulfillRandomWords(uint256, uint256[] memory randomWords) internal override {
		s_randomWords = randomWords;
		addNewShape(randomWords[0], randomWords[1]);
		emit SpotClaimed('New Spot Claimed');
	}

	function addNewShape(uint256 randomNumber1, uint256 randomNumber2) internal {
		// if there is a circle already, redo the last one to remove the class

		uint256 shapeNum = randomNumber2 % 3;
		uint256 w = 0;
		if (shapeNum == 0) {
			w = 14;
		} else if (shapeNum == 1) {
			w = 3;
		}
		if (shapeNum == 2) {
			bodySVG = string(
				abi.encodePacked(
					bodySVG,
					"<circle cx='",
					string(Strings.toString(randomNumber1 % width)),
					"' cy='",
					string(Strings.toString(randomNumber1 % height)),
					"' r='7' fill='none' stroke='",
					colors[randomNumber1 % 3],
					"' stroke-width='3' />"
				)
			);
		} else {
			bodySVG = string(
				abi.encodePacked(
					bodySVG,
					"<rect x='",
					string(Strings.toString(randomNumber1 % width)),
					"' y='",
					string(Strings.toString(randomNumber1 % height)),
					"' width='",
					string(Strings.toString(w)),
					"' height='14' fill='",
					colors[randomNumber1 % 3],
					"' />"
				)
			);
		}
		string memory _finalSVG = string(abi.encodePacked(headSVG, bodySVG, tailSVG));
		finalSVG = _finalSVG;
		string memory json = Base64.encode(
			bytes(
				string(
					abi.encodePacked(
						'{"name": "The Worlds Largest NFT",',
						'"description": "The Worlds Largest NFT for SmartCon 2022",',
						'"image": "data:image/svg+xml;base64,',
						Base64.encode(bytes(_finalSVG)),
						'"}'
					)
				)
			)
		);
		string memory finalTokenURI = string(
			abi.encodePacked('data:application/json;base64,', json)
		);
		_setTokenURI(0, finalTokenURI);
	}

	function changeCallbackGas(uint32 _callbackGasLimit) public onlyOwner {
		callbackGasLimit = _callbackGasLimit;
	}

	modifier onlyOwner() {
		require(msg.sender == s_owner);
		_;
	}

	// The following functions are overrides required by Solidity.

	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}

	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721, ERC721URIStorage)
		returns (string memory)
	{
		return super.tokenURI(tokenId);
	}
}
