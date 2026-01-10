# Testing Guide

## Overview

This guide provides comprehensive testing procedures for the PlainGov MCP server, including manual testing, automated testing strategies, and compliance verification.

## Testing Tools

### MCP Inspector

The primary tool for testing and debugging the server.

**Installation:**
```bash
cd /path/to/plain-gov-mcp
npm run inspector
```

**Access:**
Open the provided URL (typically `http://localhost:5173`) in your browser.

**Features:**
- Interactive tool testing
- Request/response inspection
- Error message viewing
- Real-time debugging
- Schema validation

### Manual Testing with Claude Desktop

Test the server in its production environment.

**Setup:**
1. Configure server in Claude Desktop (see [`DEPLOYMENT.md`](DEPLOYMENT.md))
2. Restart Claude Desktop
3. Start a new conversation
4. Invoke tools through natural language

## Test Categories

### 1. Smoke Tests

**Purpose:** Verify basic functionality after installation or changes.

**Duration:** 5-10 minutes

**Procedure:**

1. **Server Startup**
   ```bash
   npm run inspector
   ```
   - ✅ Server starts without errors
   - ✅ Inspector UI loads
   - ✅ Tools are listed

2. **Basic Tool Invocation**
   - Tool: `explain_program`
   - Input: `{ "program_id": "gst_credit" }`
   - ✅ Returns retrieved text
   - ✅ Includes source URL
   - ✅ Includes verification date

3. **Error Handling**
   - Tool: `explain_program`
   - Input: `{ "program_id": "invalid" }`
   - ✅ Returns error message
   - ✅ Error is descriptive

### 2. Functional Tests

**Purpose:** Verify each tool works correctly with valid inputs.

#### Test Case 1: explain_program

**Test 1.1: GST Credit**
```json
{
  "tool": "explain_program",
  "arguments": {
    "program_id": "gst_credit"
  }
}
```

**Expected Result:**
- ✅ Returns retrieved text from Canada.ca
- ✅ Includes source URL: `https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html`
- ✅ Includes verification date in format `YYYY-MM-DD`
- ✅ No error messages

**Test 1.2: All Programs**

Repeat for each program:
- `ccb`
- `alberta_family_employment_tax_credit`
- `gst_registration`
- `payroll_deductions`

**Validation:**
- ✅ Each returns unique content
- ✅ Each has correct source URL
- ✅ All include verification dates

#### Test Case 2: get_eligibility_criteria

**Test 2.1: GST Credit Criteria**
```json
{
  "tool": "get_eligibility_criteria",
  "arguments": {
    "program_id": "gst_credit"
  }
}
```

**Expected Result:**
- ✅ Returns retrieved text
- ✅ Includes source URL
- ✅ Includes verification date
- ✅ Content relates to eligibility

**Test 2.2: All Programs**

Test each program_id and verify results.

#### Test Case 3: eligibility_check

**Test 3.1: GST Credit - Eligible**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "gst_credit",
    "user_context": {
      "income": 45000,
      "province": "Canada"
    }
  }
}
```

**Expected Result:**
```
Eligibility Status: eligible

Reasons: 

Missing Information: None

This is not advice. Consult official sources for definitive eligibility.

**Source:** [URL] (last verified [DATE])
```

**Test 3.2: GST Credit - Not Eligible**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "gst_credit",
    "user_context": {
      "income": 60000,
      "province": "Canada"
    }
  }
}
```

**Expected Result:**
- ✅ Status: `not_eligible`
- ✅ Reasons: `Income may be too high`
- ✅ Includes disclaimer
- ✅ Includes source

**Test 3.3: GST Credit - Unclear**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "gst_credit",
    "user_context": {
      "province": "Canada"
    }
  }
}
```

**Expected Result:**
- ✅ Status: `unclear`
- ✅ Missing Information: `income`
- ✅ Includes source

**Test 3.4: Canada Child Benefit - Complete Context**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "ccb",
    "user_context": {
      "income": 65000,
      "hasChildren": true,
      "childrenAges": [2, 4],
      "province": "Canada"
    }
  }
}
```

**Expected Result:**
- ✅ Status: `eligible`
- ✅ No missing information
- ✅ Includes disclaimer and source

**Test 3.5: Alberta Family Employment Tax Credit**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "alberta_family_employment_tax_credit",
    "user_context": {
      "income": 55000,
      "hasChildren": true,
      "childrenAges": [10],
      "province": "Alberta"
    }
  }
}
```

**Expected Result:**
- ✅ Status: `eligible`
- ✅ Province validation works (Alberta required)

**Test 3.6: GST Registration**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "gst_registration",
    "user_context": {
      "taxableSupplies": 35000,
      "province": "Canada"
    }
  }
}
```

**Expected Result:**
- ✅ Status: `eligible` (over $30,000 threshold)

**Test 3.7: Payroll Deductions**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "payroll_deductions",
    "user_context": {
      "businessType": "corporation",
      "province": "Canada"
    }
  }
}
```

**Expected Result:**
- ✅ Status: `eligible`

#### Test Case 4: generate_checklist

**Test 4.1: All Programs**

For each program_id:
```json
{
  "tool": "generate_checklist",
  "arguments": {
    "program_id": "[program_id]"
  }
}
```

**Expected Result:**
- ✅ Returns retrieved text
- ✅ Includes source URL
- ✅ Includes verification date

#### Test Case 5: timeline

**Test 5.1: All Programs**

For each program_id:
```json
{
  "tool": "timeline",
  "arguments": {
    "program_id": "[program_id]"
  }
}
```

**Expected Result:**
- ✅ Returns retrieved text
- ✅ Includes source URL
- ✅ Includes verification date

#### Test Case 6: questions_for_professional

**Test 6.1: All Programs**

For each program_id:
```json
{
  "tool": "questions_for_professional",
  "arguments": {
    "program_id": "[program_id]"
  }
}
```

**Expected Result:**
- ✅ Returns retrieved text
- ✅ Includes source URL
- ✅ Includes verification date

### 3. Error Handling Tests

**Purpose:** Verify proper error handling for invalid inputs and failure scenarios.

#### Test Case 7: Invalid Program ID

**Test 7.1: Non-existent Program**
```json
{
  "tool": "explain_program",
  "arguments": {
    "program_id": "invalid_program"
  }
}
```

**Expected Result:**
- ✅ Returns error message
- ✅ Message: "Program invalid_program not found"
- ✅ No crash or undefined behavior

#### Test Case 8: Missing Required Parameters

**Test 8.1: Missing program_id**
```json
{
  "tool": "explain_program",
  "arguments": {}
}
```

**Expected Result:**
- ✅ Returns error
- ✅ Indicates missing parameter

**Test 8.2: Missing user_context**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "gst_credit"
  }
}
```

**Expected Result:**
- ✅ Returns error
- ✅ Indicates missing user_context

#### Test Case 9: Invalid User Context

**Test 9.1: Invalid Data Type**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "gst_credit",
    "user_context": {
      "income": "not a number"
    }
  }
}
```

**Expected Result:**
- ✅ Returns validation error
- ✅ Indicates type mismatch

**Test 9.2: Invalid Province**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "alberta_family_employment_tax_credit",
    "user_context": {
      "income": 50000,
      "hasChildren": true,
      "childrenAges": [5],
      "province": "Ontario"
    }
  }
}
```

**Expected Result:**
- ✅ Status: `not_eligible`
- ✅ Reasons: "Must be resident of Alberta"

#### Test Case 10: Network Failures

**Test 10.1: Simulated Network Error**

Temporarily modify source URL to invalid domain:
```typescript
url: 'https://invalid-domain-that-does-not-exist.com'
```

**Expected Result:**
- ✅ Returns retrieval error
- ✅ Error message includes details
- ✅ No fallback to prior knowledge
- ✅ No crash

**Test 10.2: HTTP Error (404)**

Temporarily modify source URL to non-existent page:
```typescript
url: 'https://www.canada.ca/non-existent-page'
```

**Expected Result:**
- ✅ Returns error with HTTP status
- ✅ Message: "HTTP 404: Not Found"

### 4. Compliance Tests

**Purpose:** Verify adherence to retrieval-first constraints.

#### Test Case 11: Source Attribution

**Test 11.1: All Tools Include Sources**

For each tool and program combination:
- ✅ Response includes source URL
- ✅ Source URL matches sources registry
- ✅ Response includes verification date
- ✅ Date format is YYYY-MM-DD

#### Test Case 12: No Prior Knowledge

**Test 12.1: Retrieval Required**

Verify that tools cannot respond without retrieval:
- ✅ No cached responses
- ✅ No hardcoded content
- ✅ All content from retrieval

**Test 12.2: Retrieval Failure Handling**

When retrieval fails:
- ✅ No fallback response
- ✅ Error returned instead
- ✅ No prior knowledge used

#### Test Case 13: Verbatim Storage

**Test 13.1: Content Preservation**

Compare retrieved content with source:
- ✅ Text matches source exactly
- ✅ No summarization
- ✅ No paraphrasing
- ✅ No content filtering

#### Test Case 14: Rules Engine Determinism

**Test 14.1: Consistent Results**

Run same eligibility check multiple times:
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "gst_credit",
    "user_context": {
      "income": 45000,
      "province": "Canada"
    }
  }
}
```

**Expected Result:**
- ✅ Same result every time
- ✅ No variation in status
- ✅ No LLM involvement

### 5. Integration Tests

**Purpose:** Test complete workflows and tool combinations.

#### Test Case 15: Complete User Journey

**Scenario:** New parent checking benefits

**Step 1:** Understand CCB
```json
{
  "tool": "explain_program",
  "arguments": { "program_id": "ccb" }
}
```
- ✅ Returns program information

**Step 2:** Check eligibility
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "ccb",
    "user_context": {
      "income": 62000,
      "hasChildren": true,
      "childrenAges": [0],
      "province": "Canada"
    }
  }
}
```
- ✅ Returns eligible status

**Step 3:** Get checklist
```json
{
  "tool": "generate_checklist",
  "arguments": { "program_id": "ccb" }
}
```
- ✅ Returns application steps

**Step 4:** Check timeline
```json
{
  "tool": "timeline",
  "arguments": { "program_id": "ccb" }
}
```
- ✅ Returns payment schedule

#### Test Case 16: Multi-Program Check

**Scenario:** User checking multiple benefits

Test eligibility for:
1. GST Credit
2. Canada Child Benefit
3. Alberta Family Employment Tax Credit

**Expected Result:**
- ✅ Each returns independent result
- ✅ No cross-contamination
- ✅ All include proper sources

### 6. Performance Tests

**Purpose:** Verify acceptable response times.

#### Test Case 17: Response Time

**Test 17.1: Single Retrieval**

Measure time for:
```json
{
  "tool": "explain_program",
  "arguments": { "program_id": "gst_credit" }
}
```

**Expected Result:**
- ✅ Response within 5 seconds
- ✅ Typical: 1-3 seconds

**Test 17.2: Eligibility Check**

Measure time for:
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "gst_credit",
    "user_context": {
      "income": 45000,
      "province": "Canada"
    }
  }
}
```

**Expected Result:**
- ✅ Response within 5 seconds
- ✅ Rules engine adds <100ms

#### Test Case 18: Concurrent Requests

**Test 18.1: Multiple Tools**

Invoke multiple tools in sequence:
- ✅ Each completes successfully
- ✅ No interference between requests
- ✅ Consistent response times

## Test Execution

### Manual Testing Checklist

Use this checklist for comprehensive manual testing:

- [ ] Server starts successfully
- [ ] All 6 tools are listed
- [ ] All 5 programs are available
- [ ] explain_program works for all programs
- [ ] get_eligibility_criteria works for all programs
- [ ] eligibility_check returns eligible correctly
- [ ] eligibility_check returns not_eligible correctly
- [ ] eligibility_check returns unclear correctly
- [ ] generate_checklist works for all programs
- [ ] timeline works for all programs
- [ ] questions_for_professional works for all programs
- [ ] Invalid program_id returns error
- [ ] Missing parameters return errors
- [ ] Invalid user_context returns error
- [ ] All responses include source URLs
- [ ] All responses include verification dates
- [ ] Network failures return errors
- [ ] No prior knowledge used
- [ ] Rules engine is deterministic

### Automated Testing

**Future Implementation:**

Create automated test suite using:
- Jest or Mocha for test framework
- Supertest for API testing
- Mock HTTP responses for reliability

**Example Test Structure:**
```typescript
describe('explain_program', () => {
  it('should return retrieved text with source', async () => {
    const response = await callTool('explain_program', {
      program_id: 'gst_credit'
    });
    
    expect(response).toContain('**Source:**');
    expect(response).toContain('last verified');
  });
});
```

## Regression Testing

**When to Run:**
- Before each release
- After code changes
- After dependency updates
- After source URL changes

**Procedure:**
1. Run smoke tests
2. Run functional tests for changed areas
3. Run compliance tests
4. Run integration tests
5. Document any failures
6. Fix issues before deployment

## Test Data

### Valid User Contexts

**GST Credit:**
```json
{
  "income": 45000,
  "province": "Canada"
}
```

**Canada Child Benefit:**
```json
{
  "income": 65000,
  "hasChildren": true,
  "childrenAges": [2, 4],
  "province": "Canada"
}
```

**Alberta Family Employment Tax Credit:**
```json
{
  "income": 55000,
  "hasChildren": true,
  "childrenAges": [10],
  "province": "Alberta"
}
```

**GST Registration:**
```json
{
  "taxableSupplies": 35000,
  "province": "Canada"
}
```

**Payroll Deductions:**
```json
{
  "businessType": "corporation",
  "province": "Canada"
}
```

## Troubleshooting Test Failures

### Common Issues

**Issue:** Server won't start
- Check Node.js version (18+)
- Run `npm install`
- Run `npm run build`
- Check for port conflicts

**Issue:** Tools not appearing
- Verify build completed successfully
- Check MCP client configuration
- Restart MCP client

**Issue:** Retrieval failures
- Check internet connection
- Verify source URLs are accessible
- Check for network proxy issues

**Issue:** Unexpected eligibility results
- Verify user_context format
- Check rules engine logic
- Review program-specific thresholds

## Continuous Testing

**Best Practices:**
1. Test after every code change
2. Test with real MCP clients regularly
3. Monitor source URL availability
4. Update tests when adding programs
5. Document test failures and resolutions

## Test Coverage Goals

- **Code Coverage:** 80%+ (future)
- **Tool Coverage:** 100% (all tools tested)
- **Program Coverage:** 100% (all programs tested)
- **Error Scenarios:** 100% (all error paths tested)
- **Compliance:** 100% (all constraints verified)

## Reporting Issues

When reporting test failures:
1. Describe the test case
2. Provide input parameters
3. Show expected vs actual results
4. Include error messages
5. Note environment details
6. Attach logs if available

## Next Steps

After testing:
1. **Review Results** - Document all findings
2. **Fix Issues** - Address any failures
3. **Deploy** - Follow [`DEPLOYMENT.md`](DEPLOYMENT.md)
4. **Monitor** - Track production behavior
5. **Iterate** - Improve tests based on findings

## Additional Resources

- [MCP Inspector Documentation](https://github.com/modelcontextprotocol/inspector)
- [API Reference](API.md)
- [Architecture Documentation](ARCHITECTURE.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

---

**Last Updated:** 2026-01-10