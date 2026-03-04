# Cerberus

Cerberus is a **DeFi automation SaaS platform** that allows users to automatically execute **token swaps on Uniswap V3** based on custom conditions.

The system continuously monitors liquidity pools and executes swaps when predefined conditions are met.  
Payments for using the platform are handled through **blockchain smart contracts**, enabling decentralized subscription management.

This project was developed as an **advanced study project** based on the **WEB23 course by LuizTools**.

---

# Architecture

Cerberus is structured as a **modular monorepo** composed of multiple independent layers:

cerberus/
│
├── backend/ # NestJS API
├── engine/ # Automation execution engine
├── blockchain/ # Smart contracts and Hardhat environment
├── frontend/ # React web application
│
└── packages/
└── commons/ # Shared models and services

Each layer has a specific responsibility in the system.

---

# System Overview

Cerberus works as a **DeFi trading automation platform**:

1. Users connect their wallet using **MetaMask**
2. Users create **automations** based on market conditions
3. The **Engine monitors Uniswap V3 pools**
4. When a condition is met, the Engine executes a **swap**
5. Trades are recorded in the database
6. The **frontend dashboard updates in real time via WebSockets**
7. The **CerberusPay smart contract** handles subscription payments

---

# Main Features

### User Management
- Wallet authentication using MetaMask
- JWT authentication
- Secure wallet storage using AES encryption

### Trading Automation
- Create swap automations
- Open/Close trading conditions
- Automated swap execution
- Automatic trade tracking

### DeFi Integration
- Uniswap V3 swaps
- Pool monitoring
- Token data from Uniswap Graph

### Dashboard
- Active trades
- Profit and Loss (PnL)
- Top pools
- Top trades
- TradingView price charts

### Blockchain Payments
- Monthly subscription via smart contract
- On-chain payment validation
- Automated payment monitoring

---

# Technology Stack

### Backend
- Node.js
- TypeScript
- NestJS
- Prisma
- MongoDB
- JWT Authentication

### Engine
- Node.js
- TypeScript
- ethers.js
- WebSocket Server

### Blockchain
- Solidity
- Hardhat
- Ethers.js
- Sepolia / Mainnet

### Frontend
- React
- WebSockets
- TradingView charts

### Shared Package
- TypeScript
- Prisma client
- Shared services and models

---

# Smart Contract

Cerberus uses a smart contract named **CerberusPay**.

The contract manages:

- user subscription payments
- payment validation
- automated billing cycles

Smart contracts are located in:

blockchain/contracts

---

# How It Works

User → Frontend
↓
Backend API
↓
Database (MongoDB)
↓
Engine monitors pools
↓
Swap execution via Uniswap
↓
Trade stored
↓
Frontend receives update via WebSocket

---

# Environment Variables

Each layer has its own `.env` configuration.

Examples can be found in each layer in the files `.env.example`

---

# Running the Project

Because Cerberus is composed of multiple services, they must be started individually.

Typical order:

1. MongoDB;
2. Blockchain node (Hardhat);
3. Backend API;
4. ENGINE;
5. Frontend;


More details are available inside each module README.

---

# Credits

This project was developed as an **advanced study project** based on the course:

WEB23 - Blockchain Development  
by **LuizTools**

https://www.luiztools.com.br/

https://github.com/luiztools

---

# License

MIT License
