// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "../utils/Ownable.sol";

contract OwnableMock is Ownable {
    constructor(address newOwner, address pendingOwner)
        Ownable(newOwner, pendingOwner)
    {}
}
