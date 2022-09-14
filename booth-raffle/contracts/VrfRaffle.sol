// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Ownable} from "./utils/Ownable.sol";

/**
 * @title The VrfRaffle contract
 * @notice A contract to allow anyone to participate in the raffle powered by Chainlink VRF
 */
contract VrfRaffle is VRFConsumerBaseV2, Ownable {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    VRFCoordinatorV2Interface internal immutable i_vrfCoordinator;
    address internal immutable i_keepersRegistry;
    uint64 internal immutable i_subscriptionId;
    bytes32 internal immutable i_keyHash;
    bytes32 internal immutable i_merkleRoot;
    uint32 internal immutable i_callbackGasLimit;
    uint16 internal immutable i_requestConfirmations;

    uint32 internal s_numWords;
    EnumerableSet.Bytes32Set internal s_participants;
    EnumerableSet.Bytes32Set internal s_winners;

    event NumWordsUpdated(uint32 numWords);
    event NewParticipant(bytes32 hashedTicketConfirmationNumber);
    event RaffleStarted(uint256 requestId);
    event RaffleWinner(bytes32 hashedTicketConfirmationNumber);
    event RaffleEnded(uint256 requestId);

    error InvalidTicket(bytes32 hashedTicketConfirmationNumber);
    error AlreadyEntered(bytes32 hashedTicketConfirmationNumber);
    error NumberTooHigh(uint32 newNumWords);
    error CallerIsNotOwnerNorKeepersRegistry();

    modifier onlyOwnerOrKeepersRegistry() {
        if (msg.sender != owner() && msg.sender != i_keepersRegistry)
            revert CallerIsNotOwnerNorKeepersRegistry();
        _;
    }

    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash,
        uint32 callbackGasLimit,
        uint16 requestConfirmations,
        uint32 numWords,
        address newOwner,
        address pendingOwner,
        address keepersRegistry,
        bytes32 merkleRoot
    ) VRFConsumerBaseV2(vrfCoordinator) Ownable(newOwner, pendingOwner) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_keepersRegistry = keepersRegistry;
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;
        i_merkleRoot = merkleRoot;
        i_callbackGasLimit = callbackGasLimit;
        i_requestConfirmations = requestConfirmations;
        s_numWords = numWords;
    }

    /**
     * @notice Sets the number of random values to get from the Chainlink VRF.
     *         Reverts if numWords is greater the MAX_NUM_WORDS from the VRF Coordinator contract.
     *
     * @dev Only owner can call.
     *
     * @param numWords - number of random values to get from the Chainlink VRF
     *
     * No return, reverts on error
     */
    function setNumWords(uint32 numWords) external onlyOwner {
        s_numWords = numWords;

        emit NumWordsUpdated(numWords);
    }

    /**
     * @notice Allows anyone at the conference to register for participation in the raffle.
     *         Reverts if User already registered.
     *
     * @param hashedTicketConfirmationNumber - User needs to provide keccak256 hash of its ticket confirmation number
     *                                         to protect User's on-chain privacy and to provide sybil resistance
     *
     * No return, reverts on error.
     */
    function enterRaffle(
        bytes32 hashedTicketConfirmationNumber,
        bytes32[] memory proof
    ) external {
        if (
            !MerkleProof.verify(
                proof,
                i_merkleRoot,
                hashedTicketConfirmationNumber
            )
        ) revert InvalidTicket(hashedTicketConfirmationNumber);
        if (
            s_participants.contains(hashedTicketConfirmationNumber) ||
            s_winners.contains(hashedTicketConfirmationNumber)
        ) revert AlreadyEntered(hashedTicketConfirmationNumber);

        s_participants.add(hashedTicketConfirmationNumber);

        emit NewParticipant(hashedTicketConfirmationNumber);
    }

    /**
     * @notice Starts raffle by requesting random values from Chainlink VRF.
     *
     * @dev Only owner can call.
     *
     * No return, reverts on error.
     */
    function startRaffle() external onlyOwnerOrKeepersRegistry {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            i_requestConfirmations,
            i_callbackGasLimit,
            s_numWords
        );

        emit RaffleStarted(requestId);
    }

    /**
     * @notice Gets the number of random values which will be requested from the VRF
     *
     * @return numWords variable
     */
    function getNumWords() external view returns (uint32) {
        return s_numWords;
    }

    /**
     * @notice Gets list of all raffle participants which are not won any prize yet.
     *
     * @return participants set
     */
    function getParticipants() external view returns (bytes32[] memory) {
        return s_participants.values();
    }

    /**
     * @notice Gets list of all raffle winners of prizes
     *
     * @return winners set
     */
    function getWinners() external view returns (bytes32[] memory) {
        return s_winners.values();
    }

    /**
     * @notice Helper function to calculate keccak256 hash of the ticket confirmation number
     *
     * @return hashed ticket confirmation number
     */
    function getHashedTicketConfirmationNumber(
        string memory ticketConfirmationNumber
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(ticketConfirmationNumber));
    }

    // @inheritdoc
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 length = s_numWords;
        for (uint256 i = 0; i < length; ) {
            bytes32 raffleWinner = s_participants.at(
                randomWords[i] % s_participants.length()
            );

            s_winners.add(raffleWinner);
            s_participants.remove(raffleWinner);

            emit RaffleWinner(raffleWinner);

            unchecked {
                ++i;
            }
        }

        emit RaffleEnded(requestId);
    }
}
