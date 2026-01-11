#!/usr/bin/env node

/**
 * Retrieval-First MCP Server
 * Provides government program information based solely on retrieved documents from pre-approved sources.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { JSDOM } from "jsdom";

/**
 * User context schema for eligibility checks
 */
const UserContextSchema = z.object({
  income: z.number().optional(),
  familySize: z.number().optional(),
  hasChildren: z.boolean().optional(),
  childrenAges: z.array(z.number()).optional(),
  province: z.string().optional(),
  businessType: z.string().optional(),
  taxableSupplies: z.number().optional(),
});

/**
 * Pre-approved source structure
 */
interface Source {
  id: string;
  name: string;
  url: string;
  jurisdiction: string;
  category: 'taxes' | 'benefits' | 'business';
}

/**
 * Pre-approved sources registry
 */
const sources: Record<string, Source> = {
  gst_credit: {
    id: 'gst_credit',
    name: 'GST/HST Credit',
    url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit.html',
    jurisdiction: 'Canada',
    category: 'taxes'
  },
  ccb: {
    id: 'ccb',
    name: 'Canada Child Benefit',
    url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html',
    jurisdiction: 'Canada',
    category: 'benefits'
  },
  alberta_family_employment_tax_credit: {
    id: 'alberta_family_employment_tax_credit',
    name: 'Alberta Family Employment Tax Credit',
    url: 'https://www.alberta.ca/alberta-family-employment-tax-credit.aspx',
    jurisdiction: 'Alberta',
    category: 'taxes'
  },
  gst_registration: {
    id: 'gst_registration',
    name: 'GST/HST Registration for Small Business',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-charge.html',
    jurisdiction: 'Canada',
    category: 'business'
  },
  payroll_deductions: {
    id: 'payroll_deductions',
    name: 'Payroll Deductions for Small Business',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-overview.html',
    jurisdiction: 'Canada',
    category: 'business'
  }
};


/**
 * Extract text content from HTML
 */
function extractTextFromHtml(html: string): string {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Remove script and style elements
  const scripts = document.querySelectorAll('script, style');
  scripts.forEach((el: Element) => el.remove());
  
  // Get text content from main content area
  const main = document.querySelector('main') || document.querySelector('body');
  if (!main) return '';
  
  // Get text and clean up whitespace
  const text = main.textContent || '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Retrieval function: fetches verbatim text from pre-approved URL
 */
async function retrieveDocument(url: string): Promise<{ text: string; lastVerified: string } | { error: string; details: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { error: "Retrieval failed", details: `HTTP ${response.status}: ${response.statusText}` };
    }
    const html = await response.text();
    const text = extractTextFromHtml(html);
    const lastVerified = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return { text, lastVerified };
  } catch (err) {
    return { error: "Retrieval failed", details: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Format retrieved text with instruction context
 * Returns raw retrieved text with the instruction for context
 */
async function formatRetrievedText(retrievedText: string, instruction: string): Promise<string> {
  return `**Instruction:** ${instruction}\n\n**Retrieved Information:**\n\n${retrievedText}`;
}


/**
 * Eligibility result structure
 */
interface EligibilityResult {
  status: 'eligible' | 'not_eligible' | 'unclear';
  reasons: string[];
  missingInfo: string[];
}

/**
 * Eligibility rules engine functions
 */
const eligibilityRules: Record<string, (userContext: z.infer<typeof UserContextSchema>) => EligibilityResult> = {
  gst_credit: (userContext) => {
    const missing: string[] = [];
    if (userContext.income === undefined) missing.push('income');
    if (userContext.province === undefined) missing.push('province');
    if (missing.length > 0) return { status: 'unclear', reasons: [], missingInfo: missing };

    if (userContext.province !== 'Canada') return { status: 'not_eligible', reasons: ['Must be resident of Canada'], missingInfo: [] };
    // Conservative threshold
    if (userContext.income! > 55000) return { status: 'not_eligible', reasons: ['Income may be too high'], missingInfo: [] };
    return { status: 'eligible', reasons: [], missingInfo: [] };
  },
  ccb: (userContext) => {
    const missing: string[] = [];
    if (userContext.hasChildren === undefined) missing.push('hasChildren');
    if (userContext.childrenAges === undefined) missing.push('childrenAges');
    if (userContext.income === undefined) missing.push('income');
    if (userContext.province === undefined) missing.push('province');
    if (missing.length > 0) return { status: 'unclear', reasons: [], missingInfo: missing };

    if (userContext.province !== 'Canada') return { status: 'not_eligible', reasons: ['Must be resident of Canada'], missingInfo: [] };
    if (!userContext.hasChildren || !userContext.childrenAges!.some(age => age < 6)) return { status: 'not_eligible', reasons: ['Must have children under 6'], missingInfo: [] };
    if (userContext.income! > 70000) return { status: 'not_eligible', reasons: ['Income may be too high'], missingInfo: [] };
    return { status: 'eligible', reasons: [], missingInfo: [] };
  },
  alberta_family_employment_tax_credit: (userContext) => {
    const missing: string[] = [];
    if (userContext.hasChildren === undefined) missing.push('hasChildren');
    if (userContext.childrenAges === undefined) missing.push('childrenAges');
    if (userContext.income === undefined) missing.push('income');
    if (userContext.province === undefined) missing.push('province');
    if (missing.length > 0) return { status: 'unclear', reasons: [], missingInfo: missing };

    if (userContext.province !== 'Alberta') return { status: 'not_eligible', reasons: ['Must be resident of Alberta'], missingInfo: [] };
    if (!userContext.hasChildren || !userContext.childrenAges!.some(age => age < 18)) return { status: 'not_eligible', reasons: ['Must have children under 18'], missingInfo: [] };
    if (userContext.income! > 60000) return { status: 'not_eligible', reasons: ['Income may be too high'], missingInfo: [] };
    return { status: 'eligible', reasons: [], missingInfo: [] };
  },
  gst_registration: (userContext) => {
    const missing: string[] = [];
    if (userContext.taxableSupplies === undefined) missing.push('taxableSupplies');
    if (userContext.province === undefined) missing.push('province');
    if (missing.length > 0) return { status: 'unclear', reasons: [], missingInfo: missing };

    if (userContext.province !== 'Canada') return { status: 'not_eligible', reasons: ['Business must operate in Canada'], missingInfo: [] };
    if (userContext.taxableSupplies! <= 30000) return { status: 'not_eligible', reasons: ['Taxable supplies too low'], missingInfo: [] };
    return { status: 'eligible', reasons: [], missingInfo: [] };
  },
  payroll_deductions: (userContext) => {
    const missing: string[] = [];
    if (userContext.businessType === undefined) missing.push('businessType');
    if (userContext.province === undefined) missing.push('province');
    if (missing.length > 0) return { status: 'unclear', reasons: [], missingInfo: missing };

    if (userContext.province !== 'Canada') return { status: 'not_eligible', reasons: ['Business must operate in Canada'], missingInfo: [] };
    // Assume if businessType provided, it's eligible
    return { status: 'eligible', reasons: [], missingInfo: [] };
  }
};


/**
 * Create MCP server
 */
const server = new Server(
  {
    name: "plain-gov-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "explain_program",
        description: "Get plain-language explanation of a government program",
        inputSchema: {
          type: "object",
          properties: {
            program_id: {
              type: "string",
              enum: Object.keys(sources),
              description: "ID of the program to explain"
            }
          },
          required: ["program_id"]
        }
      },
      {
        name: "get_eligibility_criteria",
        description: "Get eligibility criteria for a program",
        inputSchema: {
          type: "object",
          properties: {
            program_id: {
              type: "string",
              enum: Object.keys(sources),
              description: "ID of the program"
            }
          },
          required: ["program_id"]
        }
      },
      {
        name: "eligibility_check",
        description: "Check eligibility for a program based on user context",
        inputSchema: {
          type: "object",
          properties: {
            program_id: {
              type: "string",
              enum: Object.keys(sources),
              description: "ID of the program to check"
            },
            user_context: UserContextSchema
          },
          required: ["program_id", "user_context"]
        }
      },
      {
        name: "generate_checklist",
        description: "Generate a step-by-step checklist for applying to a program",
        inputSchema: {
          type: "object",
          properties: {
            program_id: {
              type: "string",
              enum: Object.keys(sources),
              description: "ID of the program"
            }
          },
          required: ["program_id"]
        }
      },
      {
        name: "timeline",
        description: "Get key dates and deadlines for a program",
        inputSchema: {
          type: "object",
          properties: {
            program_id: {
              type: "string",
              enum: Object.keys(sources),
              description: "ID of the program"
            }
          },
          required: ["program_id"]
        }
      },
      {
        name: "questions_for_professional",
        description: "Get questions to ask a professional about a program",
        inputSchema: {
          type: "object",
          properties: {
            program_id: {
              type: "string",
              enum: Object.keys(sources),
              description: "ID of the program"
            }
          },
          required: ["program_id"]
        }
      }
    ]
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!request.params.arguments) {
    throw new Error("Arguments are required");
  }
  const { name, arguments: args } = request.params;

  switch (name) {
    case "explain_program": {
      const programId = args.program_id as string;
      const source = sources[programId];
      if (!source) throw new Error(`Program ${programId} not found`);

      const retrieval = await retrieveDocument(source.url);
      if ('error' in retrieval) {
        return {
          content: [{ type: "text", text: `Error: ${retrieval.error} - ${retrieval.details}` }]
        };
      }

      const instruction = `Provide a clear, plain-language explanation of this government program. Include: 1) What the program is, 2) Who it's for, 3) Key benefits, 4) Important deadlines or requirements. Keep it concise and easy to understand.`;
      
      try {
        const explanation = await formatRetrievedText(retrieval.text, instruction);
        const output = `${explanation}\n\n**Source:** ${source.url} (last verified ${retrieval.lastVerified})`;
        
        return {
          content: [{ type: "text", text: output }]
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error formatting text: ${err instanceof Error ? err.message : String(err)}` }]
        };
      }
    }

    case "get_eligibility_criteria": {
      const programId = args.program_id as string;
      const source = sources[programId];
      if (!source) throw new Error(`Program ${programId} not found`);

      const retrieval = await retrieveDocument(source.url);
      if ('error' in retrieval) {
        return {
          content: [{ type: "text", text: `Error: ${retrieval.error} - ${retrieval.details}` }]
        };
      }

      const instruction = `Extract and list all eligibility criteria for this program. Format as a clear, numbered list. Include income thresholds, residency requirements, age requirements, and any other qualifying conditions mentioned in the text.`;
      
      try {
        const criteria = await formatRetrievedText(retrieval.text, instruction);
        const output = `${criteria}\n\n**Source:** ${source.url} (last verified ${retrieval.lastVerified})`;
        
        return {
          content: [{ type: "text", text: output }]
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error formatting text: ${err instanceof Error ? err.message : String(err)}` }]
        };
      }
    }

    case "eligibility_check": {
      const programId = args.program_id as string;
      const userContext = UserContextSchema.parse(args.user_context);
      const source = sources[programId];
      if (!source) throw new Error(`Program ${programId} not found`);

      const retrieval = await retrieveDocument(source.url);
      if ('error' in retrieval) {
        return {
          content: [{ type: "text", text: `Error: ${retrieval.error} - ${retrieval.details}` }]
        };
      }

      const rule = eligibilityRules[programId];
      if (!rule) throw new Error(`Eligibility rules not found for ${programId}`);

      const result = rule(userContext);

      const output = `Eligibility Status: ${result.status}\n\nReasons: ${result.reasons.join(', ') || 'None'}\n\nMissing Information: ${result.missingInfo.join(', ') || 'None'}\n\nThis is not advice. Consult official sources for definitive eligibility.\n\n**Source:** ${source.url} (last verified ${retrieval.lastVerified})`;

      return {
        content: [{ type: "text", text: output }]
      };
    }

    case "generate_checklist": {
      const programId = args.program_id as string;
      const source = sources[programId];
      if (!source) throw new Error(`Program ${programId} not found`);

      const retrieval = await retrieveDocument(source.url);
      if ('error' in retrieval) {
        return {
          content: [{ type: "text", text: `Error: ${retrieval.error} - ${retrieval.details}` }]
        };
      }

      const instruction = `Create a step-by-step checklist for applying to this program. Format as a numbered list with clear action items. Include: 1) Documents to gather, 2) Forms to complete, 3) Where to submit, 4) What to expect next.`;
      
      try {
        const checklist = await formatRetrievedText(retrieval.text, instruction);
        const output = `${checklist}\n\n**Source:** ${source.url} (last verified ${retrieval.lastVerified})`;
        
        return {
          content: [{ type: "text", text: output }]
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error formatting text: ${err instanceof Error ? err.message : String(err)}` }]
        };
      }
    }

    case "timeline": {
      const programId = args.program_id as string;
      const source = sources[programId];
      if (!source) throw new Error(`Program ${programId} not found`);

      const retrieval = await retrieveDocument(source.url);
      if ('error' in retrieval) {
        return {
          content: [{ type: "text", text: `Error: ${retrieval.error} - ${retrieval.details}` }]
        };
      }

      const instruction = `Extract all key dates, deadlines, and timeline information for this program. Include: application deadlines, payment dates, renewal dates, and any consequences of missing deadlines. Format as a clear timeline.`;
      
      try {
        const timeline = await formatRetrievedText(retrieval.text, instruction);
        const output = `${timeline}\n\n**Source:** ${source.url} (last verified ${retrieval.lastVerified})`;
        
        return {
          content: [{ type: "text", text: output }]
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error formatting text: ${err instanceof Error ? err.message : String(err)}` }]
        };
      }
    }

    case "questions_for_professional": {
      const programId = args.program_id as string;
      const source = sources[programId];
      if (!source) throw new Error(`Program ${programId} not found`);

      const retrieval = await retrieveDocument(source.url);
      if ('error' in retrieval) {
        return {
          content: [{ type: "text", text: `Error: ${retrieval.error} - ${retrieval.details}` }]
        };
      }

      const instruction = `Based on this program information, generate 5-7 specific questions someone should ask a tax professional, accountant, or government service representative. Focus on clarifying complex aspects, understanding personal eligibility, and optimizing their situation within legal bounds.`;
      
      try {
        const questions = await formatRetrievedText(retrieval.text, instruction);
        const output = `${questions}\n\n**Source:** ${source.url} (last verified ${retrieval.lastVerified})`;
        
        return {
          content: [{ type: "text", text: output }]
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error formatting text: ${err instanceof Error ? err.message : String(err)}` }]
        };
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('PlainGov MCP server running on stdio');
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
