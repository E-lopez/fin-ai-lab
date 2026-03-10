# Migration Quality Test Results

## Summary
- **Passed**: 8/15 tests
- **Failed**: 7/15 tests

## Failed Tests Analysis

### Test 1: Diana_Lopez payment in Sep-25
- **Expected**: 347800
- **Got**: 0
- **Issue**: Payment not found for Sep-25. Need to verify payment dates in source CSV.

### Test 5: Gustavo_Bolivar scheduled_fees
- **Expected**: 0 (all entries)
- **Got**: 100000 (all 28 entries)
- **Issue**: Amortization type detection is incorrect. Gustavo_Bolivar should NOT have french amortization.
- **Fix needed**: Update `get_loan_amortization_type()` in loan_schedule_table.py to properly detect amortization type from loan data.

### Test 7: Diana_Lopez interest_rate
- **Expected**: 0.40 (40%)
- **Got**: 0.0
- **Issue**: Interest rate not extracted from dashboard CSV or loan was skipped during migration.
- **Fix needed**: Verify Diana_Lopez has a matching dashboard file and interest rate is being extracted.

### Test 9: Elsy_Leon first payment
- **Expected**: 230410
- **Got**: 190000
- **Issue**: Wrong payment amount or wrong payment being selected as "first".
- **Fix needed**: Verify payment extraction logic and date ordering.

### Test 10: Nicolas_Topaga schedule entry count
- **Expected**: 2
- **Got**: 6
- **Issue**: Schedule extraction is picking up more rows than expected.
- **Fix needed**: Review schedule extraction logic to only capture valid payment periods.

### Test 14: Diana_Cepeda loan term_months
- **Expected**: 1
- **Got**: 27
- **Issue**: Term calculation is incorrect. Should be 1 month (Jan-26 to Apr-28 is actually 27 months, but test expects 1).
- **Note**: Test expectation may be wrong, or we need to use dashboard 'n' column instead of date calculation.

### Test 15: Total borrowers count
- **Expected**: 19
- **Got**: 16
- **Issue**: 3 borrowers missing from migration.
- **Fix needed**: Check which borrowers were skipped (likely those without interest rates).

## Recommendations

1. **Fix amortization type detection**: Query loans table to get actual amortization_type instead of defaulting to 'french'
2. **Review skipped loans**: Diana_Lopez and 2 others were skipped due to missing interest rates
3. **Validate payment extraction**: Some payments have incorrect amounts or dates
4. **Review schedule extraction**: Too many schedule entries being created for some loans
5. **Term calculation**: Use dashboard 'n' column max value instead of date difference

## Passing Tests (8/15)
- ✓ Angelica_Mogollon scheduled_principal for Abr-27
- ✓ Angelica_Mogollon scheduled_interest for Ene-28
- ✓ Nicolas_Topaga last scheduled_principal
- ✓ Daniela_Bolivar loan principal
- ✓ Daniela_Alba payment count
- ✓ Pedro_Mogollon scheduled_interest for Feb-26
- ✓ Santiago_Guevara payment in Feb-26
- ✓ Tatiana_Ariza scheduled_fees (french amortization)
