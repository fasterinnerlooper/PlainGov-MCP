/**
 * Test utilities for E2E testing
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TestResult {
  testId: string;
  tool: string;
  programId: string;
  status: 'passed' | 'failed';
  error?: string;
  errorDetails?: string;
  response?: any;
  duration: number;
  timestamp: string;
}

export interface TestCase {
  id: string;
  tool: string;
  programId: string;
  arguments: Record<string, any>;
  description: string;
}

/**
 * Create MCP client connection
 */
export async function createMCPClient(): Promise<Client> {
  const serverPath = path.resolve(__dirname, '../../build/index.js');
  
  const serverProcess = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

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
  return client;
}

/**
 * Execute a single test case
 */
export async function executeTestCase(
  client: Client,
  testCase: TestCase
): Promise<TestResult> {
  const startTime = Date.now();
  const result: TestResult = {
    testId: testCase.id,
    tool: testCase.tool,
    programId: testCase.programId,
    status: 'passed',
    duration: 0,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await client.callTool({
      name: testCase.tool,
      arguments: testCase.arguments
    });

    result.response = response;
    result.duration = Date.now() - startTime;

    // Validate response - handle the content as any to work with MCP SDK types
    const content = response.content as any;
    if (!response || !content || !Array.isArray(content) || content.length === 0) {
      result.status = 'failed';
      result.error = 'Empty response';
      result.errorDetails = 'Response content is empty or missing';
    } else {
      const firstContent = content[0];
      if (firstContent && firstContent.type === 'text' && typeof firstContent.text === 'string') {
        const text = firstContent.text;
        
        // Check for error indicators in response
        if (text.includes('Error:') || text.includes('error')) {
          result.status = 'failed';
          result.error = 'Error in response';
          result.errorDetails = text.substring(0, 500);
        }
        
        // Validate required fields for successful responses
        if (!text.includes('Source:') && !text.includes('Error:')) {
          result.status = 'failed';
          result.error = 'Missing source attribution';
          result.errorDetails = 'Response does not include source URL';
        }
      }
    }
  } catch (error) {
    result.status = 'failed';
    result.error = error instanceof Error ? error.message : String(error);
    result.errorDetails = error instanceof Error ? error.stack : undefined;
    result.duration = Date.now() - startTime;
  }

  return result;
}

/**
 * Format test results as markdown
 */
export function formatResultsAsMarkdown(results: TestResult[]): string {
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const total = results.length;
  const successRate = ((passed / total) * 100).toFixed(1);

  let markdown = `# E2E Test Results\n\n`;
  markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Total Tests:** ${total}\n`;
  markdown += `- **Passed:** ${passed} ✅\n`;
  markdown += `- **Failed:** ${failed} ❌\n`;
  markdown += `- **Success Rate:** ${successRate}%\n\n`;

  // Results by tool
  markdown += `## Results by Tool\n\n`;
  const toolGroups = groupBy(results, 'tool');
  for (const [tool, toolResults] of Object.entries(toolGroups)) {
    const toolPassed = toolResults.filter(r => r.status === 'passed').length;
    const toolTotal = toolResults.length;
    markdown += `### ${tool}\n`;
    markdown += `- Passed: ${toolPassed}/${toolTotal}\n`;
    markdown += `- Programs tested: ${toolResults.map(r => r.programId).join(', ')}\n\n`;
  }

  // Results by program
  markdown += `## Results by Program\n\n`;
  const programGroups = groupBy(results, 'programId');
  for (const [program, programResults] of Object.entries(programGroups)) {
    const programPassed = programResults.filter(r => r.status === 'passed').length;
    const programTotal = programResults.length;
    markdown += `### ${program}\n`;
    markdown += `- Passed: ${programPassed}/${programTotal}\n`;
    markdown += `- Tools tested: ${programResults.map(r => r.tool).join(', ')}\n\n`;
  }

  // Failed tests detail
  if (failed > 0) {
    markdown += `## Failed Tests Detail\n\n`;
    const failedResults = results.filter(r => r.status === 'failed');
    
    for (const result of failedResults) {
      markdown += `### ❌ ${result.testId}\n`;
      markdown += `- **Tool:** ${result.tool}\n`;
      markdown += `- **Program:** ${result.programId}\n`;
      markdown += `- **Error:** ${result.error}\n`;
      if (result.errorDetails) {
        markdown += `- **Details:**\n\`\`\`\n${result.errorDetails}\n\`\`\`\n`;
      }
      markdown += `\n`;
    }
  }

  // Test matrix
  markdown += `## Test Matrix\n\n`;
  markdown += `| Tool \\ Program | gst_credit | ccb | alberta_family_employment_tax_credit | gst_registration | payroll_deductions |\n`;
  markdown += `|----------------|------------|-----|--------------------------------------|------------------|--------------------|\n`;
  
  const tools = [...new Set(results.map(r => r.tool))];
  const programs = [...new Set(results.map(r => r.programId))];
  
  for (const tool of tools) {
    let row = `| ${tool} |`;
    for (const program of programs) {
      const result = results.find(r => r.tool === tool && r.programId === program);
      row += ` ${result?.status === 'passed' ? '✅' : '❌'} |`;
    }
    markdown += row + '\n';
  }

  return markdown;
}

/**
 * Format test results as JSON
 */
export function formatResultsAsJSON(results: TestResult[]): string {
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const total = results.length;

  return JSON.stringify({
    summary: {
      total,
      passed,
      failed,
      successRate: ((passed / total) * 100).toFixed(1) + '%',
      timestamp: new Date().toISOString()
    },
    results,
    failedTests: results.filter(r => r.status === 'failed').map(r => ({
      testId: r.testId,
      tool: r.tool,
      programId: r.programId,
      error: r.error,
      errorDetails: r.errorDetails
    }))
  }, null, 2);
}

/**
 * Helper function to group array by key
 */
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Print progress to console
 */
export function printProgress(current: number, total: number, testCase: TestCase): void {
  const percentage = ((current / total) * 100).toFixed(0);
  console.log(`[${current}/${total}] (${percentage}%) Testing: ${testCase.tool} with ${testCase.programId}`);
}

/**
 * Print summary to console
 */
export function printSummary(results: TestResult[]): void {
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const total = results.length;
  const successRate = ((passed / total) * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests:   ${total}`);
  console.log(`Passed:        ${passed} ✅`);
  console.log(`Failed:        ${failed} ❌`);
  console.log(`Success Rate:  ${successRate}%`);
  console.log('='.repeat(60) + '\n');

  if (failed > 0) {
    console.log('FAILED TESTS:');
    console.log('-'.repeat(60));
    const failedResults = results.filter(r => r.status === 'failed');
    for (const result of failedResults) {
      console.log(`❌ ${result.testId}: ${result.tool} with ${result.programId}`);
      console.log(`   Error: ${result.error}`);
    }
    console.log('-'.repeat(60) + '\n');
  }
}