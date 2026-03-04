# Cerberus Blockchain

This module contains the **smart contracts and deployment scripts** used by the Cerberus platform.

---

# Smart Contracts

Main contract:

CerberusPay

Responsibilities:

- subscription payments
- payment validation
- billing cycle tracking

---

# Tech Stack

- Solidity
- Hardhat
- Ethers.js

---

# Environment Variables

Example in the file `.env.example`

---

# Install Dependencies

npm install

---

# Compile Contracts

npx hardhat compile

--- 

# Deploy Contract

npm run deploy

---

# Verify Contract

npx hardhat verify <contract_address> --network <your network>

---

# Local Fork

You can run a **mainnet fork** using Hardhat:

npm run node

This allows testing swaps against real mainnet liquidity.
