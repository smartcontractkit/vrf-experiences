/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface VrfRaffleAbiInterface extends utils.Interface {
  functions: {
    "acceptOwnership()": FunctionFragment;
    "cancelOwnershipTransfer()": FunctionFragment;
    "enterRaffle(bytes32,bytes32[])": FunctionFragment;
    "getHashedTicketConfirmationNumber(string)": FunctionFragment;
    "getNumWords()": FunctionFragment;
    "getParticipants()": FunctionFragment;
    "getPendingOwner()": FunctionFragment;
    "getWinners()": FunctionFragment;
    "owner()": FunctionFragment;
    "rawFulfillRandomWords(uint256,uint256[])": FunctionFragment;
    "setMerkleRoot(bytes32)": FunctionFragment;
    "setNumWords(uint32)": FunctionFragment;
    "startRaffle()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "acceptOwnership"
      | "cancelOwnershipTransfer"
      | "enterRaffle"
      | "getHashedTicketConfirmationNumber"
      | "getNumWords"
      | "getParticipants"
      | "getPendingOwner"
      | "getWinners"
      | "owner"
      | "rawFulfillRandomWords"
      | "setMerkleRoot"
      | "setNumWords"
      | "startRaffle"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "acceptOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "cancelOwnershipTransfer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "enterRaffle",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getHashedTicketConfirmationNumber",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getNumWords",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getParticipants",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPendingOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getWinners",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rawFulfillRandomWords",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setMerkleRoot",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "setNumWords",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "startRaffle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelOwnershipTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enterRaffle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getHashedTicketConfirmationNumber",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNumWords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getParticipants",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPendingOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getWinners", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rawFulfillRandomWords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMerkleRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNumWords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "startRaffle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "MerkleRootUpdated(bytes32)": EventFragment;
    "NewParticipant(bytes32)": EventFragment;
    "NumWordsUpdated(uint32)": EventFragment;
    "OwnershipTransferCanceled(address,address)": EventFragment;
    "OwnershipTransferRequested(address,address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RaffleEnded(uint256)": EventFragment;
    "RaffleStarted(uint256)": EventFragment;
    "RaffleWinner(bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MerkleRootUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewParticipant"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NumWordsUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferCanceled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferRequested"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RaffleEnded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RaffleStarted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RaffleWinner"): EventFragment;
}

export interface MerkleRootUpdatedEventObject {
  merkleRoot: string;
}
export type MerkleRootUpdatedEvent = TypedEvent<
  [string],
  MerkleRootUpdatedEventObject
>;

export type MerkleRootUpdatedEventFilter =
  TypedEventFilter<MerkleRootUpdatedEvent>;

export interface NewParticipantEventObject {
  hashedTicketConfirmationNumber: string;
}
export type NewParticipantEvent = TypedEvent<
  [string],
  NewParticipantEventObject
>;

export type NewParticipantEventFilter = TypedEventFilter<NewParticipantEvent>;

export interface NumWordsUpdatedEventObject {
  numWords: number;
}
export type NumWordsUpdatedEvent = TypedEvent<
  [number],
  NumWordsUpdatedEventObject
>;

export type NumWordsUpdatedEventFilter = TypedEventFilter<NumWordsUpdatedEvent>;

export interface OwnershipTransferCanceledEventObject {
  from: string;
  to: string;
}
export type OwnershipTransferCanceledEvent = TypedEvent<
  [string, string],
  OwnershipTransferCanceledEventObject
>;

export type OwnershipTransferCanceledEventFilter =
  TypedEventFilter<OwnershipTransferCanceledEvent>;

export interface OwnershipTransferRequestedEventObject {
  from: string;
  to: string;
}
export type OwnershipTransferRequestedEvent = TypedEvent<
  [string, string],
  OwnershipTransferRequestedEventObject
>;

export type OwnershipTransferRequestedEventFilter =
  TypedEventFilter<OwnershipTransferRequestedEvent>;

export interface OwnershipTransferredEventObject {
  from: string;
  to: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface RaffleEndedEventObject {
  requestId: BigNumber;
}
export type RaffleEndedEvent = TypedEvent<[BigNumber], RaffleEndedEventObject>;

export type RaffleEndedEventFilter = TypedEventFilter<RaffleEndedEvent>;

export interface RaffleStartedEventObject {
  requestId: BigNumber;
}
export type RaffleStartedEvent = TypedEvent<
  [BigNumber],
  RaffleStartedEventObject
>;

export type RaffleStartedEventFilter = TypedEventFilter<RaffleStartedEvent>;

export interface RaffleWinnerEventObject {
  hashedTicketConfirmationNumber: string;
}
export type RaffleWinnerEvent = TypedEvent<[string], RaffleWinnerEventObject>;

export type RaffleWinnerEventFilter = TypedEventFilter<RaffleWinnerEvent>;

export interface VrfRaffleAbi extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VrfRaffleAbiInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    acceptOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    cancelOwnershipTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    enterRaffle(
      hashedTicketConfirmationNumber: PromiseOrValue<BytesLike>,
      proof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getHashedTicketConfirmationNumber(
      ticketConfirmationNumber: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getNumWords(overrides?: CallOverrides): Promise<[number]>;

    getParticipants(overrides?: CallOverrides): Promise<[string[]]>;

    getPendingOwner(overrides?: CallOverrides): Promise<[string]>;

    getWinners(overrides?: CallOverrides): Promise<[string[]]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    rawFulfillRandomWords(
      requestId: PromiseOrValue<BigNumberish>,
      randomWords: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMerkleRoot(
      merkleRoot: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setNumWords(
      numWords: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    startRaffle(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  acceptOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  cancelOwnershipTransfer(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  enterRaffle(
    hashedTicketConfirmationNumber: PromiseOrValue<BytesLike>,
    proof: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getHashedTicketConfirmationNumber(
    ticketConfirmationNumber: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getNumWords(overrides?: CallOverrides): Promise<number>;

  getParticipants(overrides?: CallOverrides): Promise<string[]>;

  getPendingOwner(overrides?: CallOverrides): Promise<string>;

  getWinners(overrides?: CallOverrides): Promise<string[]>;

  owner(overrides?: CallOverrides): Promise<string>;

  rawFulfillRandomWords(
    requestId: PromiseOrValue<BigNumberish>,
    randomWords: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMerkleRoot(
    merkleRoot: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setNumWords(
    numWords: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  startRaffle(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptOwnership(overrides?: CallOverrides): Promise<void>;

    cancelOwnershipTransfer(overrides?: CallOverrides): Promise<void>;

    enterRaffle(
      hashedTicketConfirmationNumber: PromiseOrValue<BytesLike>,
      proof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    getHashedTicketConfirmationNumber(
      ticketConfirmationNumber: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getNumWords(overrides?: CallOverrides): Promise<number>;

    getParticipants(overrides?: CallOverrides): Promise<string[]>;

    getPendingOwner(overrides?: CallOverrides): Promise<string>;

    getWinners(overrides?: CallOverrides): Promise<string[]>;

    owner(overrides?: CallOverrides): Promise<string>;

    rawFulfillRandomWords(
      requestId: PromiseOrValue<BigNumberish>,
      randomWords: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    setMerkleRoot(
      merkleRoot: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setNumWords(
      numWords: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    startRaffle(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "MerkleRootUpdated(bytes32)"(
      merkleRoot?: null
    ): MerkleRootUpdatedEventFilter;
    MerkleRootUpdated(merkleRoot?: null): MerkleRootUpdatedEventFilter;

    "NewParticipant(bytes32)"(
      hashedTicketConfirmationNumber?: null
    ): NewParticipantEventFilter;
    NewParticipant(
      hashedTicketConfirmationNumber?: null
    ): NewParticipantEventFilter;

    "NumWordsUpdated(uint32)"(numWords?: null): NumWordsUpdatedEventFilter;
    NumWordsUpdated(numWords?: null): NumWordsUpdatedEventFilter;

    "OwnershipTransferCanceled(address,address)"(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferCanceledEventFilter;
    OwnershipTransferCanceled(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferCanceledEventFilter;

    "OwnershipTransferRequested(address,address)"(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferRequestedEventFilter;
    OwnershipTransferRequested(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferRequestedEventFilter;

    "OwnershipTransferred(address,address)"(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "RaffleEnded(uint256)"(requestId?: null): RaffleEndedEventFilter;
    RaffleEnded(requestId?: null): RaffleEndedEventFilter;

    "RaffleStarted(uint256)"(requestId?: null): RaffleStartedEventFilter;
    RaffleStarted(requestId?: null): RaffleStartedEventFilter;

    "RaffleWinner(bytes32)"(
      hashedTicketConfirmationNumber?: null
    ): RaffleWinnerEventFilter;
    RaffleWinner(
      hashedTicketConfirmationNumber?: null
    ): RaffleWinnerEventFilter;
  };

  estimateGas: {
    acceptOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    cancelOwnershipTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    enterRaffle(
      hashedTicketConfirmationNumber: PromiseOrValue<BytesLike>,
      proof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getHashedTicketConfirmationNumber(
      ticketConfirmationNumber: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNumWords(overrides?: CallOverrides): Promise<BigNumber>;

    getParticipants(overrides?: CallOverrides): Promise<BigNumber>;

    getPendingOwner(overrides?: CallOverrides): Promise<BigNumber>;

    getWinners(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    rawFulfillRandomWords(
      requestId: PromiseOrValue<BigNumberish>,
      randomWords: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMerkleRoot(
      merkleRoot: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setNumWords(
      numWords: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    startRaffle(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    cancelOwnershipTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    enterRaffle(
      hashedTicketConfirmationNumber: PromiseOrValue<BytesLike>,
      proof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getHashedTicketConfirmationNumber(
      ticketConfirmationNumber: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNumWords(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getParticipants(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPendingOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getWinners(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rawFulfillRandomWords(
      requestId: PromiseOrValue<BigNumberish>,
      randomWords: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMerkleRoot(
      merkleRoot: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setNumWords(
      numWords: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    startRaffle(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
