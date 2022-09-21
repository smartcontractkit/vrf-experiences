import { Interface } from 'ethers/lib/utils';
import TMCNFT_ABI from './abis/tmcnft.abi.json'
import VRF_RAFFLE_ABI from './abis/vrfRaffle.abi.json'

export enum Contracts {
    TMCNFT,
    Raffle
}

export type ContractConfig = {
    address: string,
    abi: any
}

export type AddressMap = { [contract: number]: ContractConfig };

export const CONTRACT_REGISTRY: AddressMap = Object.freeze({
    [Contracts.TMCNFT]: {
        address: `0x9Bc15959C3792ae076229858553cDD39F8355d95`,
        abi: TMCNFT_ABI
    },
    [Contracts.Raffle]: { address: `0x7bCA4F85eec7C186faAf6297FCD6F3D0151EC0eE`, abi: VRF_RAFFLE_ABI },
});

export const vrfRaffleInterface = new Interface(VRF_RAFFLE_ABI)
