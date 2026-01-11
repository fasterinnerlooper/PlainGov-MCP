# PlainGov MCP Publication Checklist

This checklist will guide you through publishing your MCP server and setting up feedback/monetization systems.

## ✅ Code Preparation (COMPLETED)

- [x] Remove `"private": true` from package.json
- [x] Add MIT LICENSE file
- [x] Update package.json with publication metadata
- [x] Update README.md with license information

## 📦 Pre-Publication Setup

### Repository Configuration
- [x] **Update package.json author field**
  - Replace `"Your Name <your.email@example.com>"` with your actual name and email
  
- [x] **Update repository URLs in package.json**
  - Replace `https://github.com/yourusername/PlainGov-MCP.git` with your actual GitHub repository URL
  - Update in 3 places: `repository.url`, `bugs.url`, and `homepage`

- [x] **Create GitHub repository** (if not already done)
  - Initialize with existing code
  - Add repository description: "MCP server providing retrieval-first government program information from official Canadian sources"
  - Add topics: `mcp`, `model-context-protocol`, `government`, `canada`, `alberta`, `tax`, `benefits`

- [ ] **Create .npmignore file** (optional, to exclude unnecessary files from npm package)
  ```
  tests/
  plans/
  docs/
  .git/
  .gitignore
  *.md
  !README.md
  tsconfig.json
  ```

### Testing Before Publication
- [ ] **Run full build**
  ```bash
  npm run build
  ```

- [ ] **Test with MCP Inspector**
  ```bash
  npm run inspector
  ```
  - Verify all 6 tools work correctly
  - Test with sample data for each program

- [ ] **Run E2E tests**
  ```bash
  npm run test:e2e
  ```

- [ ] **Test installation locally**
  ```bash
  npm pack
  npm install -g plain-gov-mcp-0.1.0.tgz
  ```

## 🚀 Publication

### npm Registry
- [ ] **Create npm account** (if you don't have one)
  - Visit https://www.npmjs.com/signup
  
- [ ] **Login to npm**
  ```bash
  npm login
  ```

- [ ] **Publish to npm**
  ```bash
  npm publish
  ```
  
- [ ] **Verify publication**
  - Visit https://www.npmjs.com/package/plain-gov-mcp
  - Check that README displays correctly
  - Verify package metadata

### MCP Server Registry
- [ ] **Fork the MCP servers repository**
  - Visit https://github.com/modelcontextprotocol/servers
  - Click "Fork"

- [ ] **Add your server to the registry**
  - Create a new entry in the appropriate category
  - Include: name, description, npm package link, GitHub link
  - Follow their contribution guidelines

- [ ] **Submit Pull Request**
  - Clear title: "Add PlainGov MCP Server"
  - Description explaining what your server does
  - Wait for review and merge

### GitHub Release
- [ ] **Create GitHub Release v0.1.0**
  - Go to your repository → Releases → "Create a new release"
  - Tag: `v0.1.0`
  - Title: "PlainGov MCP v0.1.0 - Initial Release"
  - Description: Highlight key features and capabilities
  - Attach any relevant files

- [ ] **Enable GitHub Discussions**
  - Go to Settings → Features → Enable Discussions
  - Create categories: General, Ideas, Q&A, Show and Tell

- [ ] **Set up GitHub Issues templates**
  - Create `.github/ISSUE_TEMPLATE/bug_report.md`
  - Create `.github/ISSUE_TEMPLATE/feature_request.md`
  - You already have `tests/ISSUE_TEMPLATE.md` - consider moving/adapting it

## 📢 Marketing & Announcement

### Social Media & Communities
- [ ] **Announce on Anthropic Discord**
  - Join: https://discord.gg/anthropic
  - Post in #mcp channel
  - Include: what it does, why it's useful, link to npm/GitHub

- [ ] **Post on Reddit**
  - r/ClaudeAI - "I built an MCP server for Canadian government programs"
  - r/LocalLLaMA - Focus on the retrieval-first architecture
  - Include demo/screenshots

- [ ] **Post on Hacker News**
  - Submit as "Show HN: PlainGov MCP - Retrieval-first government info for LLMs"
  - Best time: Tuesday-Thursday, 8-10 AM EST
  - Be ready to respond to comments

- [ ] **Post on Twitter/X**
  - Use hashtags: #MCP #ModelContextProtocol #AI #GovTech
  - Tag @AnthropicAI
  - Include screenshot or demo video

### Content Creation
- [ ] **Create demo video** (2-3 minutes)
  - Show installation process
  - Demonstrate 2-3 key use cases
  - Upload to YouTube
  - Embed in README

- [ ] **Write launch blog post**
  - Problem you're solving
  - How it works (retrieval-first approach)
  - Example use cases
  - Future roadmap
  - Post on Medium, Dev.to, or personal blog

- [ ] **Create screenshots**
  - MCP Inspector showing tools
  - Example queries and responses
  - Add to README and documentation

## 📊 Feedback Collection Setup

### GitHub
- [ ] **Set up issue labels**
  - `bug`, `enhancement`, `question`, `feedback`, `good first issue`, `help wanted`

- [ ] **Create CONTRIBUTING.md** (already exists in docs/)
  - Move to root directory or ensure it's visible
  - Add "How to report bugs" section
  - Add "How to request features" section

- [ ] **Pin important issues**
  - Create "Feedback Welcome" issue
  - Create "Roadmap" issue
  - Pin both to repository

### Analytics (Optional)
- [ ] **Set up npm download tracking**
  - Use https://npm-stat.com/charts.html?package=plain-gov-mcp
  - Monitor weekly

- [ ] **Set up GitHub traffic monitoring**
  - Check Insights → Traffic regularly
  - Track views, clones, referrers

- [ ] **Create feedback form** (optional)
  - Google Forms or Typeform
  - Questions: Use case, satisfaction, feature requests, bugs
  - Link in README

### Community Building
- [ ] **Create Discord server** (optional, for larger community)
  - Channels: #general, #support, #feature-requests, #showcase
  - Link in README

- [ ] **Set up email for support**
  - Create dedicated email (e.g., support@plaingov-mcp.com)
  - Or use GitHub email
  - Add to package.json author field

## 💰 Monetization Preparation

### Infrastructure Setup
- [ ] **Choose payment processor**
  - Recommended: Stripe (supports CAD, great API)
  - Alternative: Paddle (handles tax), LemonSqueezy (merchant of record)
  - Create account

- [ ] **Create landing page**
  - Use: Carrd, Webflow, or custom Next.js site
  - Sections: Features, Pricing, FAQ, Contact
  - Include: Free tier info, paid tier benefits
  - Add signup/payment form

- [ ] **Set up license key system** (if using license model)
  - Options: Keygen.sh, Gumroad, or custom JWT solution
  - Integrate with your MCP server for validation

### Pricing Strategy
- [ ] **Finalize pricing tiers**
  - Free: 100 queries/month
  - Individual: $9.99/month CAD
  - Professional: $29.99/month CAD
  - Enterprise: Custom pricing

- [ ] **Create pricing page**
  - Clear comparison table
  - Highlight value proposition for each tier
  - Add FAQ about billing

- [ ] **Set up billing system**
  - Stripe Checkout or Billing Portal
  - Handle subscriptions, invoices, cancellations
  - Email receipts

### Legal & Compliance
- [ ] **Create Terms of Service**
  - Use template from Termly or similar
  - Specify: usage limits, data handling, liability
  - Add to website

- [ ] **Create Privacy Policy**
  - Explain: what data you collect, how you use it, retention
  - GDPR/CCPA compliance if applicable
  - Add to website

- [ ] **Set up business entity** (when ready to monetize)
  - Consider: sole proprietorship, LLC, or corporation
  - Consult with accountant for Canadian tax implications
  - Register business name if needed

### Marketing for Paid Tiers
- [ ] **Create comparison chart**
  - Free vs Paid features
  - Add to README and website

- [ ] **Offer launch discount**
  - 20-30% off for first 100 customers
  - Creates urgency and early adopters

- [ ] **Set up affiliate program** (optional)
  - Partner with tax professionals, accountants
  - Offer commission for referrals
  - Use Rewardful or similar platform

## 📈 Post-Launch Monitoring

### Week 1
- [ ] Monitor npm downloads daily
- [ ] Respond to all GitHub issues within 24 hours
- [ ] Engage with community posts/comments
- [ ] Track any bugs or critical issues
- [ ] Collect initial feedback

### Month 1
- [ ] Analyze usage patterns
- [ ] Identify most-used tools
- [ ] Gather feature requests
- [ ] Plan v0.2.0 based on feedback
- [ ] Write "One Month In" blog post

### Month 3
- [ ] Evaluate monetization readiness
- [ ] Assess community size and engagement
- [ ] Decide on paid tier launch timing
- [ ] Prepare marketing materials for paid launch

## 🎯 Success Metrics

Track these metrics to measure success:

- **Adoption:**
  - npm downloads per week
  - GitHub stars
  - Active users (if you add telemetry)

- **Engagement:**
  - GitHub issues/discussions activity
  - Community questions answered
  - Feature requests received

- **Quality:**
  - Bug reports vs. feature requests ratio
  - Average time to resolve issues
  - User satisfaction (from surveys)

- **Revenue (when monetizing):**
  - Conversion rate (free to paid)
  - Monthly recurring revenue (MRR)
  - Customer lifetime value (LTV)
  - Churn rate

## 📝 Notes

- **Don't rush monetization:** Build community and trust first (3-6 months)
- **Be responsive:** Quick responses build trust and community
- **Iterate based on feedback:** Users will tell you what they need
- **Document everything:** Good docs reduce support burden
- **Stay compliant:** Government data requires extra care with accuracy

## 🚨 Important Reminders

1. **Before publishing to npm:** Double-check all URLs in package.json are correct
2. **Test installation:** Always test `npm install -g plain-gov-mcp` before announcing
3. **Backup your npm credentials:** Store 2FA backup codes safely
4. **Monitor for security issues:** Set up GitHub security alerts
5. **Keep dependencies updated:** Run `npm audit` regularly

---

**Good luck with your launch! 🚀**

For questions or issues with this checklist, refer to:
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [MCP Documentation](https://modelcontextprotocol.io)
- [GitHub Guides](https://guides.github.com)