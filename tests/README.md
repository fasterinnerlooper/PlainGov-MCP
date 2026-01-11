# E2E Test Suite for PlainGov MCP

## Overview

This test suite performs comprehensive end-to-end testing of the PlainGov MCP server, testing all 6 tools with all 5 government programs to identify issues and ensure all tool calls return successful responses.

## Test Coverage

### Tools Tested (6)
1. `explain_program`
2. `get_eligibility_criteria`
3. `eligibility_check`
4. `generate_checklist`
5. `timeline`
6. `questions_for_professional`

### Programs Tested (5)
1. `gst_credit` - GST/HST Credit
2. `ccb` - Canada Child Benefit
3. `alberta_family_employment_tax_credit` - Alberta Family Employment Tax Credit
4. `gst_registration` - GST Registration for Small Business
5. `payroll_deductions` - Payroll Deductions for Small Business

### Total Test Cases
- **Basic Matrix Tests:** 30 (6 tools × 5 programs)
- Each test verifies:
  - Request succeeds without errors
  - Response is received
  - Response includes source URL
  - Response includes verification date
  - Response format is correct

## Quick Start

### Prerequisites
```bash
# Ensure the main server is built
npm run build
```

### Run Tests

**Full test suite (builds and runs):**
```bash
npm run test:e2e
```

**Quick run (assumes tests are already built):**
```bash
npm run test:e2e:quick
```

**Build tests only:**
```bash
npm run build:tests
```

## Test Execution

### What Happens During Test Execution

1. **Connection:** Test runner connects to the MCP server
2. **Test Generation:** Creates 30 test cases (all tool/program combinations)
3. **Sequential Execution:** Runs each test case one at a time
4. **Progress Display:** Shows real-time progress in console
5. **Result Collection:** Captures success/failure for each test
6. **Report Generation:** Creates detailed reports in JSON and Markdown formats
7. **Summary Display:** Shows test summary in console

### Expected Output

```
============================================================
PlainGov MCP E2E Test Suite
============================================================
Testing all tool/program combinations...

Generated 30 test cases

✅ Connected to MCP server

[1/30] (3%) Testing: explain_program with gst_credit
[2/30] (7%) Testing: explain_program with ccb
...
[30/30] (100%) Testing: questions_for_professional with payroll_deductions

✅ Disconnected from MCP server

============================================================
TEST SUMMARY
============================================================
Total Tests:   30
Passed:        XX ✅
Failed:        XX ❌
Success Rate:  XX%
============================================================

📄 JSON results saved to: tests/results/test-results-[timestamp].json
📄 Markdown report saved to: tests/results/test-report-[timestamp].md
📄 Latest results saved to: tests/results/latest-*
```

## Test Results

### Result Files

After running tests, you'll find results in `tests/results/`:

1. **`test-results-[timestamp].json`** - Detailed JSON results with full test data
2. **`test-report-[timestamp].md`** - Human-readable Markdown report
3. **`latest-results.json`** - Most recent JSON results (overwritten each run)
4. **`latest-report.md`** - Most recent Markdown report (overwritten each run)

### Result Structure

**JSON Format:**
```json
{
  "summary": {
    "total": 30,
    "passed": 25,
    "failed": 5,
    "successRate": "83.3%",
    "timestamp": "2026-01-11T18:00:00.000Z"
  },
  "results": [
    {
      "testId": "TC-001",
      "tool": "explain_program",
      "programId": "gst_credit",
      "status": "passed",
      "duration": 1234,
      "timestamp": "2026-01-11T18:00:00.000Z"
    }
  ],
  "failedTests": [
    {
      "testId": "TC-002",
      "tool": "get_eligibility_criteria",
      "programId": "gst_credit",
      "error": "Error message",
      "errorDetails": "Detailed error information"
    }
  ]
}
```

**Markdown Report Includes:**
- Summary statistics
- Results by tool
- Results by program
- Test matrix (visual grid)
- Detailed failure information

## Interpreting Results

### Success Criteria

A test **passes** if:
- ✅ No errors are thrown
- ✅ Response is received
- ✅ Response includes source URL
- ✅ Response includes verification date
- ✅ Content is non-empty

A test **fails** if:
- ❌ Error is thrown during execution
- ❌ Response is empty or missing
- ❌ Response contains error messages
- ❌ Required fields are missing

### Common Failure Patterns

**Pattern 1: Specific Program Fails Across Multiple Tools**
- Indicates issue with program configuration or source URL
- Check program definition in `src/index.ts`

**Pattern 2: Specific Tool Fails Across Multiple Programs**
- Indicates issue with tool implementation
- Check tool handler in `src/index.ts`

**Pattern 3: Single Tool/Program Combination Fails**
- Indicates specific interaction issue
- May be parameter validation or logic error

## Troubleshooting

### Tests Won't Run

**Issue:** `Cannot find module` errors
```bash
# Solution: Build the tests
npm run build:tests
```

**Issue:** `Server connection failed`
```bash
# Solution: Ensure main server builds successfully
npm run build
```

### All Tests Failing

**Issue:** Network connectivity
- Check internet connection
- Verify government websites are accessible

**Issue:** Server not starting
- Check `build/index.js` exists
- Verify Node.js version (18+)

### Specific Tests Failing

**Issue:** `gst_credit` tests failing
- This is the known issue we're investigating
- Review error details in test report
- Check if it's consistent across all tools or specific ones

## Test Architecture

### File Structure

```
tests/
├── e2e/
│   ├── test-runner.ts       # Main test orchestrator
│   ├── test-data.ts          # Test data and fixtures
│   └── test-utils.ts         # Helper functions
├── build/                    # Compiled test files
├── results/                  # Test results and reports
├── tsconfig.json            # TypeScript config for tests
└── README.md                # This file
```

### Key Components

**test-runner.ts**
- Generates test cases
- Manages MCP client connection
- Executes tests sequentially
- Generates reports

**test-data.ts**
- Defines tools and programs
- Contains test fixtures
- Provides user context data

**test-utils.ts**
- MCP client creation
- Test execution logic
- Result formatting
- Progress reporting

## Extending Tests

### Adding New Test Cases

Edit `test-runner.ts` to add custom test cases:

```typescript
const customTestCase: TestCase = {
  id: 'TC-CUSTOM-001',
  tool: 'explain_program',
  programId: 'gst_credit',
  arguments: { program_id: 'gst_credit' },
  description: 'Custom test description'
};
```

### Adding New Programs

1. Add program to `test-data.ts`:
```typescript
export const PROGRAMS = [
  // ... existing programs
  'new_program_id'
] as const;
```

2. Add user context if needed:
```typescript
export const VALID_USER_CONTEXTS = {
  // ... existing contexts
  new_program_id: {
    // context fields
  }
};
```

3. Rebuild and run tests

## Next Steps

After running tests:

1. **Review Results** - Check `tests/results/latest-report.md`
2. **Identify Patterns** - Look for common failure patterns
3. **Document Issues** - Create issue list from failures
4. **Fix Problems** - Address identified issues in source code
5. **Re-test** - Run tests again to verify fixes

## Support

For issues or questions:
- Review test output and error messages
- Check `tests/results/latest-report.md` for details
- Examine `tests/results/latest-results.json` for raw data
- Refer to main project documentation in `docs/`

---

**Last Updated:** 2026-01-11