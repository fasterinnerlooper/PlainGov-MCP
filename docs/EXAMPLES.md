# Usage Examples

## Overview

This guide provides real-world scenarios demonstrating how to use each tool in the PlainGov MCP server. All examples show actual tool invocations and expected response patterns.

## Available Tools

1. [`explain_program`](#explain_program) - Get plain-language explanation of a program
2. [`get_eligibility_criteria`](#get_eligibility_criteria) - Get eligibility criteria
3. [`eligibility_check`](#eligibility_check) - Check eligibility based on user context
4. [`generate_checklist`](#generate_checklist) - Get application checklist
5. [`timeline`](#timeline) - Get key dates and deadlines
6. [`questions_for_professional`](#questions_for_professional) - Get questions to ask professionals

## Available Programs

- `gst_credit` - GST/HST Credit
- `ccb` - Canada Child Benefit
- `alberta_family_employment_tax_credit` - Alberta Family Employment Tax Credit
- `gst_registration` - GST Registration for Small Business
- `payroll_deductions` - Payroll Deductions for Small Business

---

## Tool Examples

### explain_program

**Purpose:** Retrieve and display information about a government program from official sources.

#### Example 1: GST Credit

**User Request:**
```
Can you explain the GST Credit program?
```

**Tool Invocation:**
```json
{
  "tool": "explain_program",
  "arguments": {
    "program_id": "gst_credit"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text from Canada.ca about GST/HST Credit]

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html (last verified 2026-01-10)
```

**Key Points:**
- Response includes verbatim text from official source
- Source URL is always included
- Last verification date is provided
- No interpretation or summary added

#### Example 2: Canada Child Benefit

**User Request:**
```
What is the Canada Child Benefit?
```

**Tool Invocation:**
```json
{
  "tool": "explain_program",
  "arguments": {
    "program_id": "ccb"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text from Canada.ca about Canada Child Benefit]

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html (last verified 2026-01-10)
```

---

### get_eligibility_criteria

**Purpose:** Retrieve eligibility criteria from official sources.

#### Example 1: GST Credit Eligibility

**User Request:**
```
What are the eligibility requirements for GST Credit?
```

**Tool Invocation:**
```json
{
  "tool": "get_eligibility_criteria",
  "arguments": {
    "program_id": "gst_credit"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text containing eligibility criteria from official source]

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html (last verified 2026-01-10)
```

#### Example 2: Small Business GST Registration

**User Request:**
```
When do I need to register for GST as a small business?
```

**Tool Invocation:**
```json
{
  "tool": "get_eligibility_criteria",
  "arguments": {
    "program_id": "gst_registration"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text about GST registration requirements]

**Source:** https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-gst-hst.html (last verified 2026-01-10)
```

---

### eligibility_check

**Purpose:** Perform a conservative eligibility assessment using deterministic rules.

**Important:** This tool uses a rules engine, not LLM interpretation. Results are conservative estimates.

#### Example 1: GST Credit - Eligible

**User Request:**
```
Am I eligible for GST Credit? I earn $45,000 per year and live in Canada.
```

**Tool Invocation:**
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

**Expected Response:**
```
Eligibility Status: eligible

Reasons: None

Missing Information: None

This is not advice. Consult official sources for definitive eligibility.

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html (last verified 2026-01-10)
```

#### Example 2: GST Credit - Not Eligible (High Income)

**User Request:**
```
Check my GST Credit eligibility. Income: $60,000, Province: Canada
```

**Tool Invocation:**
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

**Expected Response:**
```
Eligibility Status: not_eligible

Reasons: Income may be too high

Missing Information: None

This is not advice. Consult official sources for definitive eligibility.

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html (last verified 2026-01-10)
```

#### Example 3: Canada Child Benefit - Unclear (Missing Info)

**User Request:**
```
Am I eligible for Canada Child Benefit? I have children.
```

**Tool Invocation:**
```json
{
  "tool": "eligibility_check",
  "arguments": {
    "program_id": "ccb",
    "user_context": {
      "hasChildren": true
    }
  }
}
```

**Expected Response:**
```
Eligibility Status: unclear

Reasons: 

Missing Information: childrenAges, income, province

This is not advice. Consult official sources for definitive eligibility.

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html (last verified 2026-01-10)
```

#### Example 4: Canada Child Benefit - Eligible

**User Request:**
```
Check CCB eligibility: Income $65,000, 2 children ages 2 and 4, live in Canada
```

**Tool Invocation:**
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

**Expected Response:**
```
Eligibility Status: eligible

Reasons: 

Missing Information: None

This is not advice. Consult official sources for definitive eligibility.

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html (last verified 2026-01-10)
```

#### Example 5: Alberta Family Employment Tax Credit

**User Request:**
```
Check Alberta Family Employment Tax Credit: Income $55,000, 1 child age 10, Alberta resident
```

**Tool Invocation:**
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

**Expected Response:**
```
Eligibility Status: eligible

Reasons: 

Missing Information: None

This is not advice. Consult official sources for definitive eligibility.

**Source:** https://www.alberta.ca/family-employment-tax-credit.aspx (last verified 2026-01-10)
```

#### Example 6: GST Registration - Small Business

**User Request:**
```
Do I need to register for GST? My business has $35,000 in taxable supplies in Canada.
```

**Tool Invocation:**
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

**Expected Response:**
```
Eligibility Status: eligible

Reasons: 

Missing Information: None

This is not advice. Consult official sources for definitive eligibility.

**Source:** https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-gst-hst.html (last verified 2026-01-10)
```

---

### generate_checklist

**Purpose:** Retrieve application checklist from official sources.

#### Example 1: GST Credit Checklist

**User Request:**
```
What do I need to apply for GST Credit?
```

**Tool Invocation:**
```json
{
  "tool": "generate_checklist",
  "arguments": {
    "program_id": "gst_credit"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text containing application steps and requirements]

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html (last verified 2026-01-10)
```

#### Example 2: Payroll Deductions Checklist

**User Request:**
```
Give me a checklist for setting up payroll deductions.
```

**Tool Invocation:**
```json
{
  "tool": "generate_checklist",
  "arguments": {
    "program_id": "payroll_deductions"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text about payroll deduction setup steps]

**Source:** https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-remittances.html (last verified 2026-01-10)
```

---

### timeline

**Purpose:** Retrieve key dates and deadlines from official sources.

#### Example 1: GST Credit Timeline

**User Request:**
```
When are GST Credit payments made?
```

**Tool Invocation:**
```json
{
  "tool": "timeline",
  "arguments": {
    "program_id": "gst_credit"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text containing payment dates and deadlines]

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html (last verified 2026-01-10)
```

#### Example 2: Canada Child Benefit Timeline

**User Request:**
```
What are the important dates for Canada Child Benefit?
```

**Tool Invocation:**
```json
{
  "tool": "timeline",
  "arguments": {
    "program_id": "ccb"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text about CCB payment schedule and deadlines]

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html (last verified 2026-01-10)
```

---

### questions_for_professional

**Purpose:** Retrieve suggested questions to ask professionals from official sources.

#### Example 1: GST Credit Questions

**User Request:**
```
What should I ask an accountant about GST Credit?
```

**Tool Invocation:**
```json
{
  "tool": "questions_for_professional",
  "arguments": {
    "program_id": "gst_credit"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text with guidance on professional consultation]

**Source:** https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html (last verified 2026-01-10)
```

#### Example 2: Small Business GST Registration

**User Request:**
```
What questions should I ask about GST registration for my business?
```

**Tool Invocation:**
```json
{
  "tool": "questions_for_professional",
  "arguments": {
    "program_id": "gst_registration"
  }
}
```

**Expected Response:**
```
[Retrieved verbatim text about professional consultation for GST registration]

**Source:** https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-gst-hst.html (last verified 2026-01-10)
```

---

## Real-World Scenarios

### Scenario 1: New Parent Exploring Benefits

**Context:** Sarah just had a baby and wants to know what benefits she qualifies for.

**Workflow:**

1. **Understand Canada Child Benefit**
   ```
   User: "What is the Canada Child Benefit?"
   Tool: explain_program(ccb)
   ```

2. **Check Eligibility**
   ```
   User: "Am I eligible? Income: $62,000, newborn baby, live in Ontario"
   Tool: eligibility_check(ccb, {income: 62000, hasChildren: true, childrenAges: [0], province: "Canada"})
   Result: eligible
   ```

3. **Get Application Checklist**
   ```
   User: "How do I apply?"
   Tool: generate_checklist(ccb)
   ```

4. **Check Payment Timeline**
   ```
   User: "When will I receive payments?"
   Tool: timeline(ccb)
   ```

### Scenario 2: Small Business Owner - GST Registration

**Context:** John runs a small business and needs to know if he must register for GST.

**Workflow:**

1. **Understand GST Registration**
   ```
   User: "Explain GST registration requirements"
   Tool: explain_program(gst_registration)
   ```

2. **Check Eligibility**
   ```
   User: "My business made $32,000 in taxable supplies last year in Canada"
   Tool: eligibility_check(gst_registration, {taxableSupplies: 32000, province: "Canada"})
   Result: eligible (over $30,000 threshold)
   ```

3. **Get Registration Checklist**
   ```
   User: "What do I need to register?"
   Tool: generate_checklist(gst_registration)
   ```

4. **Questions for Accountant**
   ```
   User: "What should I ask my accountant?"
   Tool: questions_for_professional(gst_registration)
   ```

### Scenario 3: Alberta Family Checking Provincial Benefits

**Context:** Maria lives in Alberta with 2 children and wants to maximize family benefits.

**Workflow:**

1. **Check Federal Benefit (CCB)**
   ```
   Tool: eligibility_check(ccb, {income: 58000, hasChildren: true, childrenAges: [5, 8], province: "Canada"})
   Result: eligible
   ```

2. **Check Provincial Benefit**
   ```
   Tool: eligibility_check(alberta_family_employment_tax_credit, {income: 58000, hasChildren: true, childrenAges: [5, 8], province: "Alberta"})
   Result: eligible
   ```

3. **Check GST Credit**
   ```
   Tool: eligibility_check(gst_credit, {income: 58000, province: "Canada"})
   Result: eligible
   ```

4. **Get Application Information**
   ```
   Tool: generate_checklist(ccb)
   Tool: generate_checklist(alberta_family_employment_tax_credit)
   Tool: generate_checklist(gst_credit)
   ```

### Scenario 4: New Business - Payroll Setup

**Context:** Tech startup hiring first employees, needs to set up payroll deductions.

**Workflow:**

1. **Understand Requirements**
   ```
   User: "What are payroll deductions?"
   Tool: explain_program(payroll_deductions)
   ```

2. **Get Setup Checklist**
   ```
   User: "How do I set up payroll deductions?"
   Tool: generate_checklist(payroll_deductions)
   ```

3. **Check Timeline**
   ```
   User: "What are the deadlines?"
   Tool: timeline(payroll_deductions)
   ```

4. **Professional Consultation**
   ```
   User: "What should I ask a payroll specialist?"
   Tool: questions_for_professional(payroll_deductions)
   ```

---

## Understanding Responses

### Source Attribution

Every response includes:
- **Source URL:** Direct link to official government page
- **Last Verified Date:** When the information was retrieved (YYYY-MM-DD format)

**Example:**
```
**Source:** https://www.canada.ca/... (last verified 2026-01-10)
```

### Eligibility Status Values

- **`eligible`** - User context meets conservative eligibility criteria
- **`not_eligible`** - User context does not meet eligibility criteria
- **`unclear`** - Insufficient information to determine eligibility

**Important:** These are conservative estimates. Always consult official sources for definitive eligibility.

### Missing Information

When eligibility is unclear, the response lists required information:

```
Missing Information: income, province, childrenAges
```

Provide this information in a follow-up eligibility check.

---

## Error Handling

### Invalid Program ID

**Request:**
```json
{
  "tool": "explain_program",
  "arguments": {
    "program_id": "invalid_program"
  }
}
```

**Response:**
```
Error: Program invalid_program not found
```

### Retrieval Failure

**Response:**
```
Error: Retrieval failed - HTTP 404: Not Found
```

or

```
Error: Retrieval failed - Network timeout
```

**Action:** Check internet connection and try again. If problem persists, the source URL may have changed.

### Invalid User Context

**Request:**
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

**Response:**
```
Error: Invalid user_context - income must be a number
```

---

## Best Practices

1. **Start with explain_program** - Understand the program before checking eligibility
2. **Provide complete context** - Include all relevant information for eligibility checks
3. **Use multiple tools** - Combine tools for comprehensive understanding
4. **Verify with official sources** - Always consult official sources for final decisions
5. **Ask professionals** - Use questions_for_professional for complex situations

## Limitations

- **No advice provided** - Server provides information only, not recommendations
- **Conservative eligibility** - Rules engine errs on side of caution
- **No optimization suggestions** - No guidance on maximizing benefits
- **Retrieval-based only** - All responses based on retrieved documents
- **No prior knowledge** - Server doesn't use information outside retrieved documents

## Next Steps

- **Review API Documentation** - See [`API.md`](API.md) for technical specifications
- **Test with Inspector** - Use [`TESTING.md`](TESTING.md) for validation procedures
- **Understand Architecture** - Read [`ARCHITECTURE.md`](ARCHITECTURE.md) for technical details

---

**Last Updated:** 2026-01-10