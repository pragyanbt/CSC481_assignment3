TicketSale Smart Contract

The `TicketSale` project is an Ethereum-based smart contract built in Solidity for managing ticket sales, swaps, and resales in a decentralized manner. This contract allows users to buy tickets, offer ticket swaps with other users, and resell their tickets, ensuring fair management and transfer of tickets using blockchain technology.

Table of Contents
- [Getting Started]
- [Features]
- [Contract Structure]
- [Installation]
- [Usage]
- [Testing]
- [License]

---

#Getting Started
The `TicketSale` contract is written in Solidity (version 0.8.17) and uses [Ganache](https://trufflesuite.com/ganache/) and [Web3.js](https://web3js.readthedocs.io/) for local Ethereum network simulation and interaction. To interact with the contract, you’ll need to deploy it to a test Ethereum network and execute transactions through a Web3-compatible platform like [Remix IDE](https://remix.ethereum.org/) or with Node.js scripts.

#Features
- **Ticket Purchasing**: Users can buy tickets by sending the required amount of Ether to the contract.
- **Swaps**: Users can offer swaps with other ticket holders and accept offers to exchange tickets with others.
- **Resales**: Users can resell their tickets by setting a resale price, allowing other users to buy these tickets.
- **Manager Control**: The contract deployer has special privileges to oversee specific actions.

#Contract Structure
The contract consists of:
- Manager: The contract deployer who can oversee ticket sales.
- Mappings: Track ticket ownership (`ticketOwners`), tickets owned by each address (`ticketsOwnedBy`), ticket resale prices (`resalePrices`), and swap offers (`swapOffers`).
- Core Functions:
  - `buyTicket`: Allows users to purchase available tickets.
  - `offerSwap`: Allows ticket owners to offer their ticket for swapping.
  - `acceptSwap`: Lets a user accept a ticket swap offer from another user.
  - `resaleTicket`: Sets a resale price for a ticket owned by the caller.
  - `acceptResale`: Allows a user to buy a resale ticket by paying the resale price.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/pragyan_bt/TicketSale.git
   cd TicketSale
