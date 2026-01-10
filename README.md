# Retrieval-First MCP Server

**Tagline:** "Government information, retrieved and explained."

This MCP server provides government program information based solely on freshly retrieved documents from pre-approved sources. It operates on a strict retrieval-first principle, ensuring all responses are grounded in official sources without prior knowledge or assumptions.

## Quick Start

```bash
cd plain-gov-mcp
npm install
npm run build
npm run inspector  # Test the server
```

See [Deployment Guide](docs/DEPLOYMENT.md) for complete installation instructions.

## What This MCP Does

- Retrieves verbatim text from pre-approved government URLs
- Provides retrieved text directly from official sources
- Performs conservative eligibility assessments using rules engine
- Includes source URLs and verification dates in all outputs

**Strict compliance:** No summaries, explanations, or answers without retrieval. Returns verbatim retrieved text only.

## Scope (v1)

- **Country + Province:** Canada + Alberta
- **Domains:** Taxes & Benefits, Small Business Administration
- **Programs:** GST Credit, Canada Child Benefit, Alberta Family Employment Tax Credit, GST Registration, Payroll Deductions

## Tools Exposed

1. `explain_program(program_id)` - Retrieved text from official source
2. `get_eligibility_criteria(program_id)` - Retrieved text from official source
3. `eligibility_check(program_id, user_context)` - Conservative eligibility assessment using rules engine
4. `generate_checklist(program_id)` - Retrieved text from official source
5. `timeline(program_id)` - Retrieved text from official source
6. `questions_for_professional(program_id)` - Retrieved text from official source

## Data Sources

- Canada.ca
- CRA official publications
- Alberta.ca program pages
- Public PDFs, bulletins, guides

**No scraping forums. No third-party "tips".**

## Architecture

- **Retrieval-First Principle:** All responses based on freshly retrieved documents from pre-approved URLs
- **Verbatim Storage:** Retrieved text stored exactly as received
- **Retrieval Operation:** Only verbatim text from pre-approved sources (no external data)
- **Rules Engine:** Deterministic eligibility checks (no LLM involvement)
- **Error Handling:** Retrieval failures return errors only, no fallbacks
- **Output Requirements:** All responses include source URL and last_verified date

**Design choice:** Retrieval only. Fail loudly on constraint violations.

## What We Explicitly DO NOT Build

❌ "How to minimise tax"  
❌ "Best way to qualify"  
❌ Edge-case exploitation  
❌ Advice framed as instruction  

**We are a translator, not a strategist.**

This keeps us out of trouble *and* attractive to institutions.

## Pricing Strategy

- **Individual:** $8–12/month CAD
- **Small business:** $19–29/month
- **Professional / org:** Seat-based or bulk licensing

*Cheap insurance against mistakes.*

## Documentation

### Getting Started
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Complete installation and configuration instructions
- **[Usage Examples](docs/EXAMPLES.md)** - Real-world scenarios and tool demonstrations

### Technical Documentation
- **[Architecture](docs/ARCHITECTURE.md)** - Technical design, data flow, and design decisions
- **[API Reference](docs/API.md)** - Tool specifications, parameters, and schemas
- **[Testing Guide](docs/TESTING.md)** - Testing procedures and validation

### Support & Contributing
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Contributing Guidelines](docs/CONTRIBUTING.md)** - How to contribute to the project

## Installation

### Quick Install

```bash
# 1. Navigate to server directory
cd plain-gov-mcp

# 2. Install dependencies
npm install

# 3. Build the server
npm run build

# 4. Test with Inspector
npm run inspector
```

### MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop):

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "plain-gov-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/plain-gov-mcp/build/index.js"
      ]
    }
  }
}
```

**Important:** Use absolute paths and restart your MCP client after configuration.

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## Usage

### Available Tools

1. **explain_program** - Get program information from official sources
2. **get_eligibility_criteria** - Retrieve eligibility requirements
3. **eligibility_check** - Check eligibility based on user context
4. **generate_checklist** - Get application checklist
5. **timeline** - Get key dates and deadlines
6. **questions_for_professional** - Get questions to ask professionals

### Example Usage

**Check GST Credit eligibility:**
```
User: "Am I eligible for GST Credit? Income: $45,000, live in Canada"

Server uses eligibility_check tool:
- Status: eligible
- Includes source URL and verification date
- Provides disclaimer
```

See [Usage Examples](docs/EXAMPLES.md) for comprehensive scenarios.

## Features

### Retrieval-First Architecture
- All responses based on freshly retrieved documents
- No cached content or prior knowledge
- Verbatim text from official sources
- Source attribution in every response

### Conservative Eligibility Assessment
- Deterministic rules engine (no LLM)
- Errs on side of caution
- Clear status indicators (eligible/not_eligible/unclear)
- Identifies missing information

### Compliance & Trust
- Strict adherence to retrieval-first constraints
- Fail loudly on errors (no fallbacks)
- Complete source traceability
- Regular verification dates

See [Architecture Documentation](docs/ARCHITECTURE.md) for technical details.

## Compliance with Constraints

- **No summaries/explanations without retrieval:** All content based on freshly retrieved documents
- **Retrieval restrictions:** Only verbatim text from pre-approved sources, no prior knowledge
- **Retrieval failures:** Return error objects only, no fallbacks
- **Output standards:** Include source URL and last_verified date in all responses
- **Rules engine:** Eligibility uses deterministic logic, no LLM
- **Fail loudly:** System errors on any constraint violation

## Ethical Guidelines

- No advice or interpretation
- Conservative eligibility assessments
- Direct to official sources only
- Clear disclaimers: "This is not advice"
- No optimization or loophole suggestions

## Testing

### Manual Testing with Inspector

```bash
npm run inspector
```

Open the provided URL in your browser to test tools interactively.

### Automated Testing

See [Testing Guide](docs/TESTING.md) for comprehensive testing procedures.

## Troubleshooting

Common issues and solutions are documented in the [Troubleshooting Guide](docs/TROUBLESHOOTING.md).

**Quick fixes:**
- Server not appearing? Check configuration file syntax and restart client
- Retrieval failures? Verify internet connection
- Tools not working? Test with MCP Inspector

## Contributing

We welcome contributions that align with the retrieval-first principles and core mission.

**Before contributing:**
1. Read [Contributing Guidelines](docs/CONTRIBUTING.md)
2. Review [Architecture Documentation](docs/ARCHITECTURE.md)
3. Understand constraint compliance requirements

**Ways to contribute:**
- Add new government programs
- Improve documentation
- Report bugs
- Suggest enhancements

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

## Project Status

**Current Version:** 0.1.0
**Status:** Production-ready with comprehensive documentation

**Completed:**
- ✅ Core retrieval-first implementation
- ✅ 5 government programs (Canada & Alberta)
- ✅ 6 tools for program information
- ✅ Deterministic eligibility rules engine
- ✅ Comprehensive documentation suite
- ✅ MCP Inspector integration
- ✅ Error handling and compliance mechanisms

**Roadmap:**
- LLM integration for formatting (with strict constraints)
- Additional provinces and programs
- Caching layer with time-based invalidation
- Enhanced rules engine
- Automated testing suite

## Support

**Documentation:** Start with [Deployment Guide](docs/DEPLOYMENT.md)
**Issues:** Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
**Questions:** Review [Usage Examples](docs/EXAMPLES.md)
**Technical:** See [Architecture Documentation](docs/ARCHITECTURE.md)

## License

[Appropriate license - TBD]

## Acknowledgments

Built with:
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
- TypeScript and Node.js
- Official Canadian government sources

---

**Last Updated:** 2026-01-10