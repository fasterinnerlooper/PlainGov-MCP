/**
 * Test data fixtures for E2E testing
 */

export const TOOLS = [
  'explain_program',
  'get_eligibility_criteria',
  'eligibility_check',
  'generate_checklist',
  'timeline',
  'questions_for_professional'
] as const;

export const PROGRAMS = [
  'gst_credit',
  'ccb',
  'alberta_family_employment_tax_credit',
  'gst_registration',
  'payroll_deductions'
] as const;

export type ToolName = typeof TOOLS[number];
export type ProgramId = typeof PROGRAMS[number];

/**
 * Valid user contexts for eligibility_check tests
 */
export const VALID_USER_CONTEXTS: Record<ProgramId, any> = {
  gst_credit: {
    income: 45000,
    province: "Canada"
  },
  ccb: {
    income: 65000,
    hasChildren: true,
    childrenAges: [2, 4],
    province: "Canada"
  },
  alberta_family_employment_tax_credit: {
    income: 55000,
    hasChildren: true,
    childrenAges: [10],
    province: "Alberta"
  },
  gst_registration: {
    taxableSupplies: 35000,
    province: "Canada"
  },
  payroll_deductions: {
    businessType: "corporation",
    province: "Canada"
  }
};

/**
 * Program metadata
 */
export const PROGRAM_INFO: Record<ProgramId, { name: string; url: string }> = {
  gst_credit: {
    name: 'GST Credit',
    url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit-overview.html'
  },
  ccb: {
    name: 'Canada Child Benefit',
    url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html'
  },
  alberta_family_employment_tax_credit: {
    name: 'Alberta Family Employment Tax Credit',
    url: 'https://www.alberta.ca/family-employment-tax-credit.aspx'
  },
  gst_registration: {
    name: 'GST Registration for Small Business',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-gst-hst.html'
  },
  payroll_deductions: {
    name: 'Payroll Deductions for Small Business',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-remittances.html'
  }
};