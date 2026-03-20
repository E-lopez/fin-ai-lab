# AI Lending Lab

A structured loan tracking and lifecycle management system designed as a foundation for AI-powered pre-legal debt recovery workflows.

This project began as a migration from spreadsheet-based lending operations into a normalized PostgreSQL-backed system, with future expansion into event-driven AI modules.

---

## Overview

AI Lending Lab provides:

- Structured borrower, loan, and payment tracking
- Deterministic balance calculation
- Automatic loan status transitions
- Clear lifecycle management
- Architecture ready for AI-driven escalation

The system is designed to evolve into a modular AI-enabled recovery pipeline with human-in-the-loop safeguards.

---

## Architecture

Frontend (Dashboard)

        ↓

FastAPI Backend

        ↓

Supabase PostgreSQL

        ↓

AI Escalation Module (planned)

Core responsibilities:

- Backend: business logic, lifecycle enforcement
- Database: single source of truth
- AI module: event-driven escalation (future phase)

---

## Tech Stack

- Python
- FastAPI
- PostgreSQL (Supabase)
- SQL migrations (version-controlled schema)
- Render (frontend hosting)
- AWS Lambda (planned AI module)

---

## Core Features (Phase 1)

- Borrower management
- Loan creation & tracking
- Payment logging
- Automatic balance recalculation
- Loan status transitions (active → overdue → pre-legal → legal → closed)

---

## AI Escalation (Planned)

Future modules will include:

- Automated pre-legal communication drafting
- Human-in-the-loop approval workflows
- Escalation logic based on configurable contract conditions
- Audit logging for AI outputs

The goal is to design an AI-ready financial workflow system, not just integrate LLM calls.

---

## Running Locally

### 1. Apply Migrations

from fin-ai-lab/scripts/migrations
```
        source venv/bin/activate
```

```
        python3 -m pip install -r requirements.txt
```

```
        export DOPPLER_TOKEN=dp.st.prd.WHQ...
```

Migrate borrowers table:
```
        python3 run_borrowers_migration.py
```

Migrate loans table:
```
        python3 run_loans_migration.py
```

Migrate loan schedules:
```
        python3 run_loan_schedule_migration.py
```

Migrate payments table:
```
        python3 run_payments_migration.py
```

Migrate payments allocation table:
```
        python3 run_payment_allocations_migration.py
```

Test migrations:
```
        python3 test_data_quality.py
        python3 test_allocation_quality.py
```

### 2. Start Backend


---

## Project Structure


---

## Status

Phase 1: Core lending lifecycle system (in development)  
Phase 2: AI-powered pre-legal escalation (planned)

---

## Design Principles

- Deterministic financial calculations
- Clear lifecycle state transitions
- Version-controlled schema evolution
- AI augmentation with human oversight
- Production-minded architecture, even at small scale