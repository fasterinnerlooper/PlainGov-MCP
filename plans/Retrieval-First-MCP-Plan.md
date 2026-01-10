# Retrieval-First MCP Server Plan

## Overview
Build a new MCP server from scratch that strictly adheres to the specified hard constraints and architecture rules. The server will focus on government program information retrieval and explanation, similar to PlainGov, but with full compliance to retrieval-first principles.

## Hard Constraints Compliance
- **No summaries/explanations/answers without retrieval**: All responses must be based on freshly retrieved documents from pre-approved URLs.
- **Retrieval failure handling**: Return error objects only, no fallbacks or prior knowledge.
- **LLM operation**: LLM receives only retrieved text + formatting instruction. No user context, external data, or prior knowledge allowed.
- **Output requirements**: All outputs include source URL(s) and last_verified date(s).
- **No model prior knowledge**: System prompts enforce strict adherence to retrieved text only.

## Architecture Rules Compliance
- **Retrieval before LLM**: Every tool call retrieves documents before any LLM processing.
- **Verbatim storage**: Retrieved text is stored and passed exactly as received.
- **LLM input restriction**: Only retrieved text + instruction passed to LLM.
- **Failure handling**: System fails loudly if any rule is violated.

## Server Design

### Pre-Approved URLs
Maintain a static registry of pre-approved government program URLs:
- GST Credit: https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html
- Canada Child Benefit: https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html
- Alberta Family Employment Tax Credit: https://www.alberta.ca/family-employment-tax-credit.aspx
- GST Registration: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-gst-hst.html
- Payroll Deductions: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-remittances.html

### Tools Specification
1. **explain_program**
   - Input: program_id (string)
   - Process: Retrieve document → LLM formats plain-language explanation
   - Output: Explanation + source + last_verified

2. **get_eligibility_criteria**
   - Input: program_id (string)
   - Process: Retrieve document → LLM extracts eligibility criteria
   - Output: Criteria list + source + last_verified

3. **eligibility_check** (Rules Engine)
   - Input: program_id (string), user_context (object)
   - Process: Use static rules engine (no LLM) to assess eligibility
   - Output: Status + reasons + source + last_verified

4. **generate_checklist**
   - Input: program_id (string)
   - Process: Retrieve document → LLM generates checklist
   - Output: Checklist + source + last_verified

5. **timeline**
   - Input: program_id (string)
   - Process: Retrieve document → LLM extracts timeline
   - Output: Timeline + source + last_verified

6. **questions_for_professional**
   - Input: program_id (string)
   - Process: Retrieve document → LLM suggests questions
   - Output: Questions + source + last_verified

### Rules Engine for Eligibility
Since LLM cannot receive user_context, eligibility_check uses a deterministic rules engine:
- Define eligibility rules per program based on official criteria
- Rules check user_context against hardcoded thresholds/logic
- No interpretation or LLM involvement
- Conservative assessments (err on side of "unclear" or "needs professional review")

### Implementation Phases
1. **Setup**: Create new server structure, dependencies
2. **Core Functions**: Implement retrieval and LLM formatting functions
3. **Rules Engine**: Define eligibility rules for each program
4. **Tool Handlers**: Implement each MCP tool with retrieval-first logic
5. **Error Handling**: Ensure all failure cases return appropriate errors
6. **Testing**: Validate compliance with constraints
7. **Documentation**: Update README and API docs

### Technical Stack
- TypeScript/Node.js
- MCP SDK
- OpenAI API (with strict system prompts)
- Zod for validation

### Compliance Verification
- Every tool call must retrieve before LLM
- LLM prompts must prohibit prior knowledge
- All outputs include sources and dates
- No static data used in LLM responses (except for rules engine)
- Retrieval failures result in errors only

This plan ensures the new server is built from scratch with strict adherence to all specified constraints.