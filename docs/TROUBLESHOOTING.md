# Troubleshooting Guide

## Overview

This guide provides solutions to common issues encountered when installing, configuring, and using the PlainGov MCP server.

## Quick Diagnostic Checklist

Before diving into specific issues, run through this quick checklist:

- [ ] Node.js version 18.0.0 or higher installed
- [ ] Dependencies installed (`npm install`)
- [ ] Server built successfully (`npm run build`)
- [ ] Configuration file has valid JSON syntax
- [ ] Absolute paths used in configuration
- [ ] Internet connection active
- [ ] MCP client restarted after configuration changes

## Installation Issues

### Issue: npm install fails

**Symptoms:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Possible Causes:**
- Missing package.json
- Corrupted npm cache
- Network connectivity issues
- Permission problems

**Solutions:**

1. **Verify you're in the correct directory:**
   ```bash
   cd /path/to/PlainGov-MCP/plain-gov-mcp
   ls package.json  # Should exist
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Check npm registry connectivity:**
   ```bash
   npm ping
   ```

4. **Fix permissions (macOS/Linux):**
   ```bash
   sudo chown -R $USER ~/.npm
   ```

5. **Use different registry (if behind firewall):**
   ```bash
   npm config set registry https://registry.npmjs.org/
   npm install
   ```

### Issue: Build fails with TypeScript errors

**Symptoms:**
```
error TS2307: Cannot find module '@modelcontextprotocol/sdk'
```

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Verify TypeScript version:**
   ```bash
   npx tsc --version  # Should be 5.3.3 or compatible
   ```

3. **Check tsconfig.json exists:**
   ```bash
   ls tsconfig.json
   ```

### Issue: Permission denied on build/index.js

**Symptoms:**
```
Error: EACCES: permission denied
```

**Solutions:**

**macOS/Linux:**
```bash
chmod +x build/index.js
```

**Windows:**
- Right-click build/index.js
- Properties > Security
- Ensure your user has Read & Execute permissions

## Configuration Issues

### Issue: Server not appearing in Claude Desktop

**Symptoms:**
- Server not listed in available tools
- No MCP indicator in Claude Desktop
- Tools don't appear when requested

**Solutions:**

1. **Verify configuration file location:**

   **macOS:**
   ```bash
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

   **Windows:**
   ```powershell
   type %APPDATA%\Claude\claude_desktop_config.json
   ```

   **Linux:**
   ```bash
   cat ~/.config/Claude/claude_desktop_config.json
   ```

2. **Validate JSON syntax:**
   - Use a JSON validator (e.g., jsonlint.com)
   - Check for missing commas, quotes, or brackets
   - Ensure no trailing commas

3. **Verify absolute paths:**
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

4. **Test path validity:**

   **macOS/Linux:**
   ```bash
   ls -la /absolute/path/to/plain-gov-mcp/build/index.js
   ```

   **Windows:**
   ```cmd
   dir C:\absolute\path\to\plain-gov-mcp\build\index.js
   ```

5. **Completely restart Claude Desktop:**
   - Quit application (not just close window)
   - Wait 5 seconds
   - Restart application
   - Wait for full initialization

6. **Check Claude Desktop logs:**

   **macOS:**
   ```bash
   tail -f ~/Library/Logs/Claude/mcp*.log
   ```

   **Windows:**
   ```powershell
   Get-Content "$env:APPDATA\Claude\logs\mcp*.log" -Wait
   ```

### Issue: Path with spaces not working

**Symptoms:**
```
Error: Cannot find module '/path/to/plain'
```

**Solutions:**

1. **Use proper escaping in JSON:**
   ```json
   {
     "args": [
       "/path/with spaces/plain-gov-mcp/build/index.js"
     ]
   }
   ```
   Note: JSON strings don't need escaping for spaces

2. **Avoid spaces in installation path:**
   - Reinstall in path without spaces
   - Example: `/home/user/projects/` instead of `/home/user/My Projects/`

## Runtime Issues

### Issue: Server starts but tools don't work

**Symptoms:**
- Server appears in Claude Desktop
- Tools listed but return errors when invoked
- "Tool not found" errors

**Solutions:**

1. **Test with MCP Inspector:**
   ```bash
   cd /path/to/plain-gov-mcp
   npm run inspector
   ```
   - Open provided URL
   - Test tools directly
   - Check for error messages

2. **Verify build is up to date:**
   ```bash
   npm run build
   ```

3. **Check for TypeScript compilation errors:**
   - Review build output
   - Fix any errors in source code
   - Rebuild

4. **Restart MCP client:**
   - Completely quit and restart
   - Wait for full initialization

### Issue: Retrieval failures

**Symptoms:**
```
Error: Retrieval failed - HTTP 404: Not Found
Error: Retrieval failed - Network timeout
```

**Solutions:**

1. **Check internet connection:**
   ```bash
   ping www.canada.ca
   ```

2. **Test source URLs directly:**
   - Open URLs in browser
   - Verify pages load correctly
   - Check for redirects or changes

3. **Check for proxy/firewall:**
   - Verify Node.js can access internet
   - Configure proxy if needed:
     ```bash
     npm config set proxy http://proxy.company.com:8080
     npm config set https-proxy http://proxy.company.com:8080
     ```

4. **Verify DNS resolution:**
   ```bash
   nslookup www.canada.ca
   ```

5. **Check for rate limiting:**
   - Wait a few minutes
   - Try again
   - Reduce request frequency

6. **Update source URLs if changed:**
   - Government websites may reorganize
   - Check official sites for new URLs
   - Update sources registry in code

### Issue: Slow response times

**Symptoms:**
- Tools take >5 seconds to respond
- Timeouts occur frequently

**Solutions:**

1. **Check network speed:**
   ```bash
   curl -o /dev/null -s -w '%{time_total}\n' https://www.canada.ca
   ```

2. **Verify server resources:**
   - Check CPU usage
   - Check memory usage
   - Close unnecessary applications

3. **Test with different network:**
   - Try different WiFi network
   - Test with wired connection
   - Check for network congestion

4. **Monitor for DNS issues:**
   - Use alternative DNS (e.g., 8.8.8.8)
   - Clear DNS cache:
     
     **Windows:**
     ```cmd
     ipconfig /flushdns
     ```
     
     **macOS:**
     ```bash
     sudo dscacheutil -flushcache
     ```
     
     **Linux:**
     ```bash
     sudo systemd-resolve --flush-caches
     ```

### Issue: Memory usage high

**Symptoms:**
- Server uses excessive memory
- System becomes slow
- Out of memory errors

**Solutions:**

1. **Restart server:**
   - Quit MCP client
   - Restart MCP client
   - Monitor memory usage

2. **Check for memory leaks:**
   - Monitor over time
   - Report if consistently increasing

3. **Reduce concurrent requests:**
   - Wait for responses before new requests
   - Avoid rapid-fire tool invocations

## Tool-Specific Issues

### Issue: eligibility_check returns "unclear"

**Symptoms:**
```
Eligibility Status: unclear
Missing Information: income, province
```

**Solutions:**

1. **Provide all required information:**
   ```json
   {
     "program_id": "gst_credit",
     "user_context": {
       "income": 45000,
       "province": "Canada"
     }
   }
   ```

2. **Check required fields per program:**
   - GST Credit: `income`, `province`
   - CCB: `income`, `province`, `hasChildren`, `childrenAges`
   - Alberta FETC: `income`, `province`, `hasChildren`, `childrenAges`
   - GST Registration: `taxableSupplies`, `province`
   - Payroll: `businessType`, `province`

3. **Verify data types:**
   - `income`: number (not string)
   - `hasChildren`: boolean (true/false)
   - `childrenAges`: array of numbers
   - `province`: string

### Issue: Invalid user_context error

**Symptoms:**
```
Error: Invalid user_context - income must be a number
```

**Solutions:**

1. **Check data types:**
   ```json
   {
     "income": 45000,          // ✅ number
     "hasChildren": true,      // ✅ boolean
     "childrenAges": [2, 4],   // ✅ array of numbers
     "province": "Canada"      // ✅ string
   }
   ```

2. **Common mistakes:**
   ```json
   {
     "income": "45000",        // ❌ string instead of number
     "hasChildren": "true",    // ❌ string instead of boolean
     "childrenAges": "2,4",    // ❌ string instead of array
     "province": Canada        // ❌ missing quotes
   }
   ```

### Issue: Wrong eligibility result

**Symptoms:**
- Expected "eligible" but got "not_eligible"
- Unexpected reasons provided

**Solutions:**

1. **Review rules engine thresholds:**
   - GST Credit: Income threshold $55,000
   - CCB: Income threshold $70,000, children under 6
   - Alberta FETC: Income threshold $60,000, children under 18
   - GST Registration: Taxable supplies > $30,000

2. **Remember conservative approach:**
   - Rules engine errs on side of caution
   - "Not eligible" may mean "possibly not eligible"
   - Always consult official sources for definitive answer

3. **Check province requirements:**
   - Some programs require specific provinces
   - Alberta FETC requires `province: "Alberta"`
   - Federal programs require `province: "Canada"`

## Error Messages

### Common Error Messages and Solutions

#### "Program [id] not found"

**Cause:** Invalid program_id

**Solution:** Use valid program IDs:
- `gst_credit`
- `ccb`
- `alberta_family_employment_tax_credit`
- `gst_registration`
- `payroll_deductions`

#### "Arguments are required"

**Cause:** Missing tool arguments

**Solution:** Provide required arguments for the tool

#### "Retrieval failed - HTTP [status]"

**Cause:** Source URL returned error

**Solutions:**
- Check internet connection
- Verify URL is still valid
- Wait and retry
- Report if persistent

#### "Cannot find module"

**Cause:** Missing dependencies or incorrect path

**Solutions:**
- Run `npm install`
- Verify build completed
- Check configuration paths

#### "EACCES: permission denied"

**Cause:** Insufficient file permissions

**Solutions:**
- Fix file permissions (chmod +x)
- Run with appropriate user
- Check directory permissions

**Note:** The server does not require any API keys or environment variables for operation. All functionality is based on retrieving documents from public government websites.

## Platform-Specific Issues

### Windows

#### Issue: Backslashes in paths

**Solution:** Use double backslashes or forward slashes:
```json
{
  "args": [
    "C:\\path\\to\\build\\index.js"
  ]
}
```
or
```json
{
  "args": [
    "C:/path/to/build/index.js"
  ]
}
```

#### Issue: PowerShell execution policy

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Issue: Node.js not in PATH

**Solution:**
- Reinstall Node.js with "Add to PATH" option
- Or use full path to node.exe:
  ```json
  {
    "command": "C:\\Program Files\\nodejs\\node.exe"
  }
  ```

### macOS

#### Issue: Gatekeeper blocking execution

**Solution:**
- System Preferences > Security & Privacy
- Allow the application
- Or: `xattr -d com.apple.quarantine /path/to/file`

#### Issue: Shell configuration not loading

**Solution:**
- Check which shell: `echo $SHELL`
- Edit correct file: `~/.zshrc` or `~/.bash_profile`
- Source file: `source ~/.zshrc`

### Linux

#### Issue: Node.js version too old

**Solution:**
```bash
# Using nvm
nvm install 18
nvm use 18

# Or using package manager
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Issue: Permission denied on /usr/local

**Solution:**
```bash
sudo chown -R $USER /usr/local
```

## Debugging Techniques

### Using MCP Inspector

**Best debugging tool for MCP servers:**

1. **Start Inspector:**
   ```bash
   cd /path/to/plain-gov-mcp
   npm run inspector
   ```

2. **Open in browser:**
   - Navigate to provided URL (usually http://localhost:5173)

3. **Test tools:**
   - Select tool from dropdown
   - Enter arguments
   - Click "Run"
   - View response and errors

4. **Check logs:**
   - View server output in terminal
   - Check for error messages
   - Monitor network requests

### Checking Server Logs

**Enable verbose logging:**

Add to server code (temporary):
```typescript
console.error('Debug:', JSON.stringify(data, null, 2));
```

**View logs:**
- Terminal output when using Inspector
- Claude Desktop logs (see Configuration Issues)

### Testing Network Connectivity

**Test source URLs:**
```bash
curl -I https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html
```

**Expected:** HTTP 200 OK

### Validating Configuration

**JSON validation:**
```bash
# Using Python
python -m json.tool < claude_desktop_config.json

# Using jq
jq . claude_desktop_config.json
```

## Getting Help

### Before Asking for Help

Gather this information:

1. **Environment:**
   - Operating system and version
   - Node.js version (`node --version`)
   - npm version (`npm --version`)

2. **Configuration:**
   - MCP client configuration (remove API keys)
   - Installation path

3. **Error Details:**
   - Exact error message
   - Steps to reproduce
   - Expected vs actual behavior

4. **Logs:**
   - Server output
   - MCP client logs
   - Inspector output

### Resources

- **Documentation:** [`README.md`](../README.md)
- **API Reference:** [`API.md`](API.md)
- **Examples:** [`EXAMPLES.md`](EXAMPLES.md)
- **Architecture:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **Testing:** [`TESTING.md`](TESTING.md)

### Reporting Issues

When reporting issues:

1. **Search existing issues first**
2. **Provide complete information** (see above)
3. **Include minimal reproduction steps**
4. **Attach relevant logs**
5. **Describe expected behavior**

## Prevention

### Best Practices

1. **Keep dependencies updated:**
   ```bash
   npm update
   npm audit fix
   ```

2. **Use absolute paths:**
   - Avoid relative paths in configuration
   - Use full paths to avoid ambiguity

3. **Test after changes:**
   - Test with Inspector after code changes
   - Verify in MCP client before committing

4. **Monitor source URLs:**
   - Check periodically for changes
   - Update if URLs change

5. **Backup configuration:**
   - Keep copy of working configuration
   - Document custom settings

6. **Regular restarts:**
   - Restart MCP client periodically
   - Clear caches if issues arise

## Still Having Issues?

If you've tried everything in this guide:

1. **Use MCP Inspector** - Isolate the issue
2. **Check recent changes** - What changed before the issue?
3. **Try minimal configuration** - Remove optional settings
4. **Test on different machine** - Rule out environment issues
5. **Review documentation** - Check for missed steps
6. **Ask for help** - Provide complete information

---

**Last Updated:** 2026-01-10