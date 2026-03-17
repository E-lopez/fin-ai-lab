# Backend Tests

Comprehensive test suite for AI Lending Lab backend API.

## Running Tests

### Run all tests
```bash
python run_tests.py
```

Or using pytest directly:
```bash
pytest tests/ -v
```

### Run specific test file
```bash
pytest tests/test_borrowers.py -v
```

### Run with coverage
```bash
pytest tests/ --cov=. --cov-report=html
```

## Test Structure

- `conftest.py` - Pytest fixtures and configuration
- `test_borrowers.py` - Borrower endpoint tests
- `test_loans.py` - Loan endpoint tests
- `test_loan_schedules.py` - Loan schedule endpoint tests
- `test_payments.py` - Payment endpoint tests
- `test_payment_allocations.py` - Payment allocation endpoint tests
- `test_utils.py` - Utility function tests

## Test Database

Tests use an in-memory SQLite database for:
- Fast execution
- Isolation between tests
- No external dependencies
- Clean state for each test

## Requirements

Install test dependencies:
```bash
pip install -r requirements.txt
```

Required packages:
- pytest
- pytest-cov
- httpx
