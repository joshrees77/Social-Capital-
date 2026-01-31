# Product Specification (Frozen)

## Overview
Build a web app that lets users choose between **Lend** and **Borrow**, authenticate with Twitter via Privy, and create or fund ERC-4626 loan vaults via a factory contract.

## Homepage
- Primary fork with two actions:
  - **Lend**
  - **Borrow**

## Lend Marketplace
- Display a list of loan vault cards.
- Each card summarizes vault metadata and lending terms relevant to lenders.

## Borrow Wizard
- **Step 1: Privy Twitter login**
  - Use Privy React SDK.
  - Embedded wallet enabled.
- **Step 2: Loan terms form**
  - Collect loan terms required to describe the borrow request.
- **Step 3: Deploy vault**
  - Deploy an ERC-4626 vault via a factory contract.

## Data Mapping
- **Twitter data (off-chain):** retrieved via Privy and associated with the borrower profile.
- **Vault addresses (on-chain):** created via the factory contract.
- **USDT inside vaults (on-chain):** assets held by each vault.
- **Loan terms (off-chain):** stored off-chain and **keyed by vault address** for MVP.

> **MVP Constraint:** Loan terms are stored off-chain and keyed by vault address.

## Required Routes (App Router)
- `/` — Homepage with Lend / Borrow fork.
- `/lend` — Lend marketplace with vault cards.
- `/borrow` — Borrow wizard entry and steps.

## Required Components
- `HomeFork` — Lend / Borrow selection.
- `LendMarketplace` — List of loan vault cards.
- `VaultCard` — Single vault summary card.
- `BorrowWizard` — Multi-step borrow flow.
- `BorrowStepLogin` — Privy Twitter login step (embedded wallet).
- `BorrowStepTerms` — Loan terms form step.
- `BorrowStepDeploy` — Deploy vault step (factory call).

## Required API Endpoints (MVP)
- `POST /api/loan-terms` — Create or update loan terms keyed by vault address.
- `GET /api/loan-terms?vaultAddress=...` — Fetch loan terms by vault address.

## Out of Scope (for now)
- No contract ABI assumptions beyond acknowledging a factory deploy call.
- No on-chain storage for loan terms in MVP.
- No additional scaffolding, dependencies, or UI implementation in this step.
