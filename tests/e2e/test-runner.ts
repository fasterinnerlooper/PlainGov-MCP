#!/usr/bin/env node

/**
 * E2E Test Runner for PlainGov MCP
 * Tests all tool/program combinations to identify issues
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  TOOLS,
  PROGRAMS,
  VALID_USER_CONTEXTS,
  type ToolName,
  type ProgramId
} from "./test-data.js";
import {
  type TestCase,
  type TestResult,
  executeTestCase,
  formatResultsAsMarkdown,
  formatResultsAsJSON,
  printProgress,
  printSummary
} from "./test-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate all basic test cases (tool x program matrix)
 */
function generateBasicTestCases(): TestCase[] {
  const testCases: TestCase[] = [];
  let testId = 1;

  for (const tool of TOOLS) {
    for (const programId of PROGRAMS) {
      const args: Record<string, any> = { program_id: programId };
      
      // Add user_context for eligibility_check
      if (tool === 'eligibility_check') {
        args.user_context = VALID_USER_CONTEXTS[programId];
      }

      testCases.push({
        id: `TC-${String(testId).padStart(3, '0')}`,
        tool,
        programId,
        arguments: args,
        description: `Test ${tool} with ${programId}`
      });
      
      testId++;
    }
  }

  return testCases;
}

/**
 * Create MCP client connection
 */
async function createMCPClient(): Promise<Client> {
  // Go up from tests/build/e2e to project root, then to build/index.js
  const serverPath = path.resolve(__dirname, '../../../build/index.js');
  
  console.log(`Connecting to MCP server: ${serverPath}`);
  
  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath]
  });

  const client = new Client(
    {
      name: "e2e-test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);
  console.log('✅ Connected to MCP server\n');
  
  return client;
}

/**
 * Run all test cases
 */
async function runTests(): Promise<TestResult[]> {
  console.log('='.repeat(60));
  console.log('PlainGov MCP E2E Test Suite');
  console.log('='.repeat(60));
  console.log('Testing all tool/program combinations...\n');

  const testCases = generateBasicTestCases();
  console.log(`Generated ${testCases.length} test cases\n`);

  let client: Client | null = null;
  const results: TestResult[] = [];

  try {
    client = await createMCPClient();

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      printProgress(i + 1, testCases.length, testCase);

      const result = await executeTestCase(client, testCase);
      results.push(result);

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error('\n❌ Fatal error during test execution:');
    console.error(error);
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('\n✅ Disconnected from MCP server');
      } catch (error) {
        console.error('Error closing client:', error);
      }
    }
  }

  return results;
}

/**
 * Save results to files
 */
function saveResults(results: TestResult[]): void {
  const resultsDir = path.resolve(__dirname, '../results');
  
  // Create results directory if it doesn't exist
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Save JSON results
  const jsonPath = path.join(resultsDir, `test-results-${timestamp}.json`);
  fs.writeFileSync(jsonPath, formatResultsAsJSON(results));
  console.log(`\n📄 JSON results saved to: ${jsonPath}`);

  // Save Markdown report
  const mdPath = path.join(resultsDir, `test-report-${timestamp}.md`);
  fs.writeFileSync(mdPath, formatResultsAsMarkdown(results));
  console.log(`📄 Markdown report saved to: ${mdPath}`);

  // Save latest results (overwrite)
  const latestJsonPath = path.join(resultsDir, 'latest-results.json');
  fs.writeFileSync(latestJsonPath, formatResultsAsJSON(results));
  
  const latestMdPath = path.join(resultsDir, 'latest-report.md');
  fs.writeFileSync(latestMdPath, formatResultsAsMarkdown(results));
  console.log(`📄 Latest results saved to: ${resultsDir}/latest-*`);
}

/**
 * Main execution
 */
async function main() {
  try {
    const results = await runTests();
    
    printSummary(results);
    saveResults(results);

    // Exit with error code if any tests failed
    const failedCount = results.filter(r => r.status === 'failed').length;
    if (failedCount > 0) {
      console.log(`\n⚠️  ${failedCount} test(s) failed. Review the report for details.`);
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Test suite failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
// Convert process.argv[1] to file URL for proper comparison on all platforms
const scriptPath = fileURLToPath(import.meta.url);
const argPath = process.argv[1];

// Normalize paths for comparison (handles Windows vs Unix paths)
if (path.resolve(scriptPath) === path.resolve(argPath)) {
  main();
}

export { runTests, generateBasicTestCases };