# Contributing Guidelines

## Welcome

Thank you for your interest in contributing to the PlainGov MCP server! This document provides guidelines and standards for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Adding New Programs](#adding-new-programs)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Requirements](#documentation-requirements)
- [Constraint Compliance](#constraint-compliance)
- [Pull Request Process](#pull-request-process)
- [Review Process](#review-process)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences
- Accept responsibility for mistakes

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

## How to Contribute

### Reporting Bugs

**Before submitting a bug report:**
1. Check existing issues to avoid duplicates
2. Verify the bug with the latest version
3. Test with MCP Inspector to isolate the issue

**Bug Report Template:**
```markdown
**Description:**
Clear description of the bug

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [e.g., Windows 11, macOS 14]
- Node.js version: [e.g., 18.17.0]
- MCP Client: [e.g., Claude Desktop]

**Additional Context:**
Any other relevant information
```

### Suggesting Enhancements

**Enhancement Proposal Template:**
```markdown
**Feature Description:**
Clear description of the proposed feature

**Use Case:**
Why is this feature needed?

**Proposed Implementation:**
How might this be implemented?

**Alternatives Considered:**
What other approaches were considered?

**Impact on Constraints:**
How does this affect retrieval-first principles?
```

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Update documentation
6. Submit pull request

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- Text editor or IDE (VS Code recommended)

### Initial Setup

1. **Fork and Clone:**
   ```bash
   git clone https://github.com/yourusername/PlainGov-MCP.git
   cd PlainGov-MCP/plain-gov-mcp
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Build:**
   ```bash
   npm run build
   ```

4. **Test:**
   ```bash
   npm run inspector
   ```

### Development Workflow

1. **Create Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes:**
   - Edit source files in `src/`
   - Follow code standards (see below)

3. **Build and Test:**
   ```bash
   npm run build
   npm run inspector
   ```

4. **Commit Changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and Create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Development Commands

```bash
# Build the project
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Run MCP Inspector
npm run inspector

# Clean build directory
rm -rf build/
```

## Adding New Programs

### Source Approval Criteria

Before adding a new program, verify the source meets these criteria:

- ✅ Official government domain (.ca, .gc.ca, .gov)
- ✅ Publicly accessible (no login required)
- ✅ Authoritative source (not third-party)
- ✅ Regularly maintained and updated
- ✅ Stable URL (not likely to change frequently)
- ✅ Contains complete program information

### Step-by-Step Process

#### 1. Add to Sources Registry

Edit [`src/index.ts`](../plain-gov-mcp/src/index.ts):

```typescript
const sources: Record<string, Source> = {
  // ... existing sources
  
  new_program_id: {
    id: 'new_program_id',
    name: 'Human-Readable Program Name',
    url: 'https://official.government.ca/program-page',
    jurisdiction: 'Canada', // or 'Alberta', 'Ontario', etc.
    category: 'benefits' // or 'taxes', 'business'
  }
};
```

**Naming Conventions:**
- Use snake_case for IDs
- Be descriptive but concise
- Include jurisdiction if provincial
- Example: `ontario_child_care_benefit`

#### 2. Create Eligibility Rules

Add to eligibility rules engine:

```typescript
const eligibilityRules: Record<string, (userContext: z.infer<typeof UserContextSchema>) => EligibilityResult> = {
  // ... existing rules
  
  new_program_id: (userContext) => {
    const missing: string[] = [];
    
    // Check for required information
    if (userContext.requiredField === undefined) {
      missing.push('requiredField');
    }
    
    // Return unclear if missing information
    if (missing.length > 0) {
      return { 
        status: 'unclear', 
        reasons: [], 
        missingInfo: missing 
      };
    }
    
    // Apply eligibility logic (conservative)
    if (userContext.someCondition) {
      return { 
        status: 'not_eligible', 
        reasons: ['Reason for ineligibility'], 
        missingInfo: [] 
      };
    }
    
    // Default to eligible if all checks pass
    return { 
      status: 'eligible', 
      reasons: [], 
      missingInfo: [] 
    };
  }
};
```

**Rules Engine Guidelines:**
- Be conservative (favor "unclear" over "eligible")
- Use clear, specific reasons
- Check all required fields first
- Apply thresholds from official criteria
- No interpretation or inference
- Document threshold sources

#### 3. Update User Context Schema (if needed)

If the program requires new user context fields:

```typescript
const UserContextSchema = z.object({
  // ... existing fields
  newField: z.string().optional(),
  anotherField: z.number().optional(),
});
```

#### 4. Test the New Program

**Manual Testing:**
```bash
npm run build
npm run inspector
```

Test each tool with the new program_id:
- `explain_program`
- `get_eligibility_criteria`
- `eligibility_check` (with various contexts)
- `generate_checklist`
- `timeline`
- `questions_for_professional`

**Verification Checklist:**
- [ ] Source URL is accessible
- [ ] Retrieved text is relevant
- [ ] Source attribution appears
- [ ] Verification date is included
- [ ] Eligibility rules work correctly
- [ ] All status values tested (eligible, not_eligible, unclear)
- [ ] Missing information detected correctly
- [ ] Error handling works

#### 5. Update Documentation

**Update [`docs/API.md`](API.md):**
- Add program to available programs list
- Document any new user_context fields

**Update [`docs/EXAMPLES.md`](EXAMPLES.md):**
- Add usage examples for the new program
- Include eligibility check examples

**Update [`README.md`](../README.md):**
- Add to programs list if significant

#### 6. Commit Changes

```bash
git add .
git commit -m "feat: add [program name] support

- Add source to registry
- Implement eligibility rules
- Add tests and documentation
- Verify compliance with constraints"
```

### Example: Adding Ontario Child Care Benefit

```typescript
// 1. Add to sources
ontario_child_care_benefit: {
  id: 'ontario_child_care_benefit',
  name: 'Ontario Child Care Benefit',
  url: 'https://www.ontario.ca/page/child-care-benefit',
  jurisdiction: 'Ontario',
  category: 'benefits'
}

// 2. Add eligibility rules
ontario_child_care_benefit: (userContext) => {
  const missing: string[] = [];
  if (userContext.income === undefined) missing.push('income');
  if (userContext.hasChildren === undefined) missing.push('hasChildren');
  if (userContext.childrenAges === undefined) missing.push('childrenAges');
  if (userContext.province === undefined) missing.push('province');
  if (missing.length > 0) return { status: 'unclear', reasons: [], missingInfo: missing };

  if (userContext.province !== 'Ontario') {
    return { status: 'not_eligible', reasons: ['Must be resident of Ontario'], missingInfo: [] };
  }
  if (!userContext.hasChildren || !userContext.childrenAges!.some(age => age < 13)) {
    return { status: 'not_eligible', reasons: ['Must have children under 13'], missingInfo: [] };
  }
  if (userContext.income! > 75000) {
    return { status: 'not_eligible', reasons: ['Income may be too high'], missingInfo: [] };
  }
  return { status: 'eligible', reasons: [], missingInfo: [] };
}
```

## Code Standards

### TypeScript Style

**General:**
- Use TypeScript strict mode
- Prefer `const` over `let`
- Use explicit types for function parameters and returns
- Avoid `any` type

**Naming:**
- `camelCase` for variables and functions
- `PascalCase` for types and interfaces
- `UPPER_SNAKE_CASE` for constants
- `snake_case` for program IDs

**Example:**
```typescript
// ✅ Good
const programId = 'gst_credit';
const MAX_RETRIES = 3;

interface EligibilityResult {
  status: string;
  reasons: string[];
}

async function retrieveDocument(url: string): Promise<DocumentResult> {
  // ...
}

// ❌ Bad
let program_id = 'gst_credit';
const max_retries = 3;

interface eligibilityResult {
  Status: string;
  Reasons: string[];
}

async function RetrieveDocument(url: any) {
  // ...
}
```

### Error Handling

**Always handle errors explicitly:**

```typescript
// ✅ Good
try {
  const response = await fetch(url);
  if (!response.ok) {
    return { 
      error: "Retrieval failed", 
      details: `HTTP ${response.status}: ${response.statusText}` 
    };
  }
  return { text: await response.text(), lastVerified: new Date().toISOString() };
} catch (err) {
  return { 
    error: "Retrieval failed", 
    details: err instanceof Error ? err.message : String(err) 
  };
}

// ❌ Bad
const response = await fetch(url);
return { text: await response.text() };
```

### Comments

**Use comments for:**
- Complex logic explanation
- Constraint compliance notes
- TODO items (with issue reference)
- Function documentation

**Example:**
```typescript
/**
 * Retrieval function: fetches verbatim text from pre-approved URL
 * 
 * CONSTRAINT: No caching, always fresh retrieval
 * CONSTRAINT: Return verbatim text only, no modification
 */
async function retrieveDocument(url: string): Promise<DocumentResult> {
  // Validate URL against sources registry
  // ...
  
  // Perform retrieval (no retry logic per constraints)
  // ...
}
```

### Formatting

**Use consistent formatting:**
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Max line length: 100 characters

**Configure editor:**
```json
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "typescript.preferences.quoteStyle": "single"
}
```

## Testing Requirements

### Required Tests

Before submitting a PR, verify:

1. **Smoke Tests:**
   - [ ] Server builds without errors
   - [ ] Server starts successfully
   - [ ] All tools are listed

2. **Functional Tests:**
   - [ ] New features work as expected
   - [ ] Existing features still work
   - [ ] Error cases handled properly

3. **Compliance Tests:**
   - [ ] Retrieval-first principle maintained
   - [ ] Source attribution included
   - [ ] No prior knowledge used
   - [ ] Errors fail loudly

4. **Integration Tests:**
   - [ ] Works with MCP Inspector
   - [ ] Works with Claude Desktop
   - [ ] All tools accessible

### Testing Checklist

```markdown
- [ ] Built successfully (`npm run build`)
- [ ] Tested with Inspector (`npm run inspector`)
- [ ] Tested all affected tools
- [ ] Tested error cases
- [ ] Verified source attribution
- [ ] Checked for regressions
- [ ] Tested on target platform(s)
```

See [`TESTING.md`](TESTING.md) for detailed testing procedures.

## Documentation Requirements

### Required Documentation Updates

When making changes, update relevant documentation:

**Code Changes:**
- [ ] Update [`API.md`](API.md) if tools or schemas change
- [ ] Update [`EXAMPLES.md`](EXAMPLES.md) with usage examples
- [ ] Update [`ARCHITECTURE.md`](ARCHITECTURE.md) if architecture changes

**New Features:**
- [ ] Add to [`README.md`](../README.md)
- [ ] Add examples to [`EXAMPLES.md`](EXAMPLES.md)
- [ ] Update [`API.md`](API.md) with specifications

**Bug Fixes:**
- [ ] Update [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) if relevant
- [ ] Add to changelog (if maintained)

### Documentation Style

**Be clear and concise:**
- Use simple language
- Provide examples
- Include expected outputs
- Link to related documentation

**Use consistent formatting:**
- Markdown for all documentation
- Code blocks with language specification
- Proper heading hierarchy
- Links to related sections

## Constraint Compliance

### Hard Constraints

All contributions must maintain these constraints:

1. **No summaries/explanations without retrieval**
   - All content must be based on retrieved documents
   - No prior knowledge or assumptions

2. **Retrieval failures return errors only**
   - No fallback responses
   - No graceful degradation
   - Explicit error messages

3. **LLM operates only on retrieved text + instruction**
   - No user context in LLM prompts (future feature)
   - No external data
   - No prior knowledge

4. **All outputs include source URL and date**
   - Every response must have source attribution
   - Verification date in YYYY-MM-DD format

### Compliance Checklist

Before submitting:

- [ ] All responses based on retrieval
- [ ] No cached or prior knowledge used
- [ ] Retrieval failures return errors
- [ ] Source URLs included in all outputs
- [ ] Verification dates included
- [ ] Rules engine is deterministic (no LLM)
- [ ] No interpretation or inference
- [ ] Conservative eligibility assessments

### Constraint Violations

**Examples of violations:**

❌ Returning cached content without fresh retrieval  
❌ Providing fallback response when retrieval fails  
❌ Using prior knowledge to answer questions  
❌ Omitting source URL or verification date  
❌ Using LLM for eligibility decisions  
❌ Making assumptions about user context  

## Pull Request Process

### Before Submitting

1. **Test thoroughly:**
   - Run all tests
   - Test with MCP Inspector
   - Test with MCP client

2. **Update documentation:**
   - Update relevant docs
   - Add examples if needed

3. **Review changes:**
   - Check for constraint compliance
   - Verify code quality
   - Remove debug code

4. **Commit properly:**
   - Use conventional commits
   - Write clear messages
   - Reference issues if applicable

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested with MCP Inspector
- [ ] Tested with Claude Desktop
- [ ] All existing tests pass
- [ ] Added new tests (if applicable)

## Documentation
- [ ] Updated API.md
- [ ] Updated EXAMPLES.md
- [ ] Updated README.md
- [ ] Updated other docs (specify)

## Constraint Compliance
- [ ] Maintains retrieval-first principle
- [ ] Includes source attribution
- [ ] Handles errors properly
- [ ] No prior knowledge used

## Screenshots (if applicable)
[Add screenshots here]

## Additional Notes
[Any additional information]
```

### Commit Message Format

Use conventional commits:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(sources): add Ontario Child Care Benefit

- Add source to registry
- Implement eligibility rules
- Add documentation and examples

Closes #123
```

```
fix(retrieval): handle network timeout errors

- Add timeout handling
- Improve error messages
- Update tests

Fixes #456
```

## Review Process

### Review Criteria

PRs are reviewed for:

1. **Functionality:**
   - Works as intended
   - No regressions
   - Handles edge cases

2. **Code Quality:**
   - Follows code standards
   - Well-structured
   - Properly commented

3. **Testing:**
   - Adequate test coverage
   - Tests pass
   - Edge cases covered

4. **Documentation:**
   - Complete and accurate
   - Examples provided
   - Clear and concise

5. **Constraint Compliance:**
   - Maintains retrieval-first principle
   - Proper error handling
   - Source attribution

### Review Timeline

- Initial review: Within 3-5 business days
- Follow-up reviews: Within 2 business days
- Approval and merge: After all checks pass

### Addressing Feedback

1. **Read feedback carefully**
2. **Ask questions if unclear**
3. **Make requested changes**
4. **Update PR description if needed**
5. **Request re-review**

## Questions?

If you have questions:

1. Check existing documentation
2. Search existing issues
3. Ask in discussions (if available)
4. Create a new issue with "question" label

## Thank You!

Your contributions help make PlainGov MCP better for everyone. We appreciate your time and effort!

---

**Last Updated:** 2026-01-10