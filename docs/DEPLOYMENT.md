# Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying and configuring the PlainGov MCP server with MCP-compatible clients.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** version 18.0.0 or higher
- **npm** version 8.0.0 or higher
- An MCP-compatible client (e.g., Claude Desktop)

### Verify Prerequisites

```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

## Installation

### 1. Clone or Download the Repository

```bash
git clone https://github.com/yourusername/PlainGov-MCP.git
cd PlainGov-MCP/plain-gov-mcp
```

Or download and extract the ZIP file, then navigate to the `plain-gov-mcp` directory.

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `zod` - Schema validation

### 3. Build the Server

```bash
npm run build
```

This compiles the TypeScript code to JavaScript in the `build/` directory and makes the entry point executable.

### 4. Verify Installation

Test the server using the MCP Inspector:

```bash
npm run inspector
```

The Inspector will provide a URL (typically `http://localhost:5173`) to access debugging tools in your browser. If the server starts successfully, your installation is complete.

## Environment Configuration

The server currently requires no environment variables for basic operation. All functionality is based on document retrieval from public government websites.

**Note:** Future versions may add optional LLM integration for text formatting, which would require API keys. The current version operates without any external API dependencies beyond standard HTTP requests.

## MCP Client Configuration

### Claude Desktop

Claude Desktop is the primary MCP client for this server.

#### Configuration File Locations

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

#### Configuration Format

Edit the configuration file and add the server configuration:

```json
{
  "mcpServers": {
    "plain-gov-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/PlainGov-MCP/plain-gov-mcp/build/index.js"
      ]
    }
  }
}
```

**Important Notes:**
- Use **absolute paths** - relative paths may not work
- Replace `/absolute/path/to/` with your actual installation path
- Ensure proper JSON syntax (commas, quotes, brackets)

#### Platform-Specific Path Examples

**macOS Example:**
```json
{
  "mcpServers": {
    "plain-gov-mcp": {
      "command": "node",
      "args": [
        "/Users/username/projects/PlainGov-MCP/plain-gov-mcp/build/index.js"
      ]
    }
  }
}
```

**Windows Example:**
```json
{
  "mcpServers": {
    "plain-gov-mcp": {
      "command": "node",
      "args": [
        "C:\\Users\\username\\projects\\PlainGov-MCP\\plain-gov-mcp\\build\\index.js"
      ]
    }
  }
}
```

**Linux Example:**
```json
{
  "mcpServers": {
    "plain-gov-mcp": {
      "command": "node",
      "args": [
        "/home/username/projects/PlainGov-MCP/plain-gov-mcp/build/index.js"
      ]
    }
  }
}
```

### Other MCP-Compatible Clients

The server follows the standard MCP protocol and should work with any MCP-compatible client. Refer to your client's documentation for specific configuration instructions.

## Verification Steps

### 1. Restart Claude Desktop

After updating the configuration file:
1. Completely quit Claude Desktop
2. Restart the application
3. Wait for initialization to complete

### 2. Verify Server Connection

In Claude Desktop, you should see the PlainGov MCP server listed in the available tools. You can verify by:

1. Starting a new conversation
2. Looking for the MCP tools indicator
3. Attempting to use one of the tools (e.g., `explain_program`)

### 3. Test Basic Functionality

Try a simple tool call:

```
Can you explain the GST Credit program?
```

Claude should use the `explain_program` tool and return information retrieved from the official source, including the source URL and verification date.

### 4. Using MCP Inspector for Debugging

If the server doesn't appear in Claude Desktop, use the Inspector for debugging:

```bash
cd /path/to/PlainGov-MCP/plain-gov-mcp
npm run inspector
```

Open the provided URL in your browser and test the tools directly. This helps identify:
- Server startup issues
- Tool invocation problems
- Response formatting issues
- Error messages

## Platform-Specific Notes

### Windows

**Path Separators:**
- Use double backslashes (`\\`) in JSON configuration
- Or use forward slashes (`/`) which also work on Windows

**PowerShell Execution:**
If you encounter execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**File Permissions:**
Ensure the `build/index.js` file is readable. Windows typically doesn't require explicit execute permissions for Node.js scripts.

### macOS

**File Permissions:**
The build script automatically sets execute permissions, but if needed:
```bash
chmod +x /path/to/plain-gov-mcp/build/index.js
```

**Gatekeeper:**
If macOS blocks execution, you may need to allow the application in System Preferences > Security & Privacy.


### Linux

**File Permissions:**
Ensure execute permissions:
```bash
chmod +x /path/to/plain-gov-mcp/build/index.js
```

**Node.js Installation:**
If Node.js is not in PATH, use the full path to node:
```json
{
  "mcpServers": {
    "plain-gov-mcp": {
      "command": "/usr/bin/node",
      "args": ["/path/to/build/index.js"]
    }
  }
}
```

## Troubleshooting

### Server Not Appearing in Claude Desktop

1. **Check configuration file syntax** - Validate JSON format
2. **Verify absolute paths** - Ensure paths are correct and absolute
3. **Restart Claude Desktop** - Completely quit and restart
4. **Check server logs** - Use MCP Inspector to see error messages
5. **Verify Node.js version** - Must be 18.0.0 or higher

### Tools Not Working

1. **Check internet connection** - Server retrieves from government websites
2. **Verify program IDs** - Use exact IDs from documentation
3. **Review error messages** - Check for retrieval failures or validation errors
4. **Test with Inspector** - Isolate client vs server issues

### Build Failures

1. **Clear node_modules** - Delete and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. **Check TypeScript version** - Should be 5.3.3 or compatible
3. **Verify file permissions** - Ensure write access to build directory

For more detailed troubleshooting, see [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md).

## Next Steps

After successful deployment:

1. **Review Usage Examples** - See [`EXAMPLES.md`](EXAMPLES.md) for real-world scenarios
2. **Understand Architecture** - Read [`ARCHITECTURE.md`](ARCHITECTURE.md) for technical details
3. **Test Functionality** - Follow [`TESTING.md`](TESTING.md) for validation procedures
4. **Configure Environment** - See [`ENVIRONMENT.md`](ENVIRONMENT.md) for advanced configuration

## Support

If you encounter issues not covered in this guide:

1. Check [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)
2. Review [`API.md`](API.md) for tool specifications
3. Use MCP Inspector for debugging
4. Report issues on GitHub (if applicable)

## Security Reminders

- Use absolute paths in configuration
- Ensure proper file permissions on build directory
- Keep configuration files secure
- Review server logs for unexpected activity

---

**Last Updated:** 2026-01-10