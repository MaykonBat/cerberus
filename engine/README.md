# Cerberus Engine

The Engine is responsible for **executing trading automations**.

It continuously monitors liquidity pools from **Uniswap V3** and triggers swaps when conditions are met.

---

# Responsibilities

- Pool monitoring
- Automation evaluation
- Swap execution
- Trade creation
- Payment monitoring
- WebSocket notifications

---

# Environment Variables

Example in the file `.env.example`

---

# Engine Workflow

Load pools from Uniswap Graph
↓
Load automations
↓
Evaluate conditions
↓
Execute swap
↓
Store trade
↓
Notify frontend

---

# Running the Engine

Install dependencies:

- npm install

Start Engine: 

- npm run start

---

# Swap Execution

Swaps are executed using **ethers.js** and the **Uniswap V3 router contract**.
