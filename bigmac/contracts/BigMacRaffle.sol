// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {Ownable} from "./utils/Ownable.sol";

/**
 * @title The BigMacRaffle contract
 * @notice A contract to determine winners of BigMac lunch with Sergey Nazarov at SmartCon 2022 powered by Chainlink VRF
 */
contract BigMacRaffle is VRFConsumerBaseV2, Ownable {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    VRFCoordinatorV2Interface internal immutable i_vrfCoordinator;
    uint64 internal immutable i_subscriptionId;
    bytes32 internal immutable i_keyHash;
    uint32 internal immutable i_callbackGasLimit;
    uint16 internal immutable i_requestConfirmations;

    uint32 internal s_numWords;
    bool internal s_isRaffleStarted;
    EnumerableSet.Bytes32Set internal s_participants;
    EnumerableSet.Bytes32Set internal s_winners;

    event RaffleStarted(uint256 requestId);
    event RaffleWinner(bytes32 hashedTicketConfirmationNumber);
    event RaffleEnded(uint256 requestId);

    error RaffleCanBeRunOnlyOnce();

    modifier onlyOnce() {
        if (s_isRaffleStarted) revert RaffleCanBeRunOnlyOnce();
        _;
    }

    constructor(
        bytes32[] memory participants,
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash,
        uint32 callbackGasLimit,
        uint16 requestConfirmations,
        uint32 numWords,
        address newOwner,
        address pendingOwner
    ) VRFConsumerBaseV2(vrfCoordinator) Ownable(newOwner, pendingOwner) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;
        i_callbackGasLimit = callbackGasLimit;
        i_requestConfirmations = requestConfirmations;
        s_numWords = numWords;

        uint256 length = participants.length;
        for (uint i = 0; i < length; ) {
            s_participants.add(participants[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Runs BigMac raffle.
     *         Reverts if already called.
     *         Reverts if caller is not an owner.
     *
     * @dev Only owner can call.
     *
     * No return, reverts on error.
     */
    function runRaffle() external onlyOwner onlyOnce {
        s_isRaffleStarted = true;
        requestRandomWords();
    }

    /**
     * @notice Draws additional winners if someone is unable to attend the event.
     *
     * @dev Only owner can call.
     *
     * No return, reverts on error.
     */
    function drawAdditionalWinners(uint32 numberOfAdditionalWinners)
        external
        onlyOwner
    {
        s_numWords = numberOfAdditionalWinners;
        requestRandomWords();
    }

    /**
     * @notice Returns BigMac raffle winners' keccak256 hashes of SmartCon 2022 ticket numbers.
     *
     * @return BigMac raffle winners
     */
    function getWinners() external view returns (bytes32[] memory) {
        return s_winners.values();
    }

    /**
     * @notice Requests random values from Chainlink VRF
     *
     * No return, reverts on error
     */
    function requestRandomWords() internal {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            i_requestConfirmations,
            i_callbackGasLimit,
            s_numWords
        );

        emit RaffleStarted(requestId);
    }

    // @inheritdoc
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        virtual
        override
    {
        uint256 length = s_numWords;
        for (uint i = 0; i < length; ) {
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
