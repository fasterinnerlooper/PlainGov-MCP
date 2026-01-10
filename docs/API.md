# PlainGov MCP API Documentation

## Overview

PlainGov MCP provides tools for retrieving verbatim text from official Canadian government sources, focusing on taxes, benefits, and small business administration.

## Tools

### 1. explain_program

**Purpose:** Get the retrieved text from the official source for a government program.

**Parameters:**
- `program_id` (string, required): ID of the program (e.g., "gst_credit")

**Response:** Retrieved text with source URL and verification date.

**Example:**
```json
{
  "program_id": "gst_credit"
}
```

### 2. get_eligibility_criteria

**Purpose:** Get the retrieved text from the official source for a program.

**Parameters:**
- `program_id` (string, required): ID of the program

**Response:** Retrieved text with source URL and verification date.

### 3. eligibility_check

**Purpose:** Check likely eligibility for a program based on provided context.

**Parameters:**
- `program_id` (string, required): ID of the program
- `user_context` (object, required): Structured user facts

**Response:** Status (eligible/unclear/not_eligible), reasons, missing info.

**User Context Schema:**
```typescript
{
  income?: number;
  familySize?: number;
  hasChildren?: boolean;
  childrenAges?: number[];
  province?: string;
  businessType?: string;
  taxableSupplies?: number;
}
```

### 4. generate_checklist

**Purpose:** Get the retrieved text from the official source for a program.

**Parameters:**
- `program_id` (string, required): ID of the program

**Response:** Retrieved text with source URL and verification date.

### 5. timeline

**Purpose:** Get the retrieved text from the official source for a program.

**Parameters:**
- `program_id` (string, required): ID of the program

**Response:** Retrieved text with source URL and verification date.

### 6. questions_for_professional

**Purpose:** Get the retrieved text from the official source for a program.

**Parameters:**
- `program_id` (string, required): ID of the program

**Response:** Retrieved text with source URL and verification date.

## Available Programs

- `gst_credit`: GST/HST Credit
- `ccb`: Canada Child Benefit
- `alberta_family_employment_tax_credit`: Alberta Family Employment Tax Credit
- `gst_registration`: GST Registration for Small Business
- `payroll_deductions`: Payroll Deductions for Small Business

## Integration

Use with MCP-compatible clients. Tools are deterministic and do not provide advice.

## Disclaimers

- Outputs are translations, not advice
- Always consult official sources
- Eligibility checks are conservative estimates
- No optimization or loophole suggestions