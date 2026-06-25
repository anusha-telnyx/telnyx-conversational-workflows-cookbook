# Telnyx Conversational Workflows Cookbook

Learn how to build a Telnyx Conversational Workflow by walking through a realistic inbound auto-claim intake example.

This cookbook is meant for someone who wants to understand the pattern, not just copy files. It shows how to design the conversation, add decision branches, collect fields, call backend tools, handle fallbacks, and review structured call results.

## What You Will Build

A caller phones an insurance claims line. The workflow asks what happened, checks whether the situation is urgent, collects the details needed for a first notice of loss, calls a claim-intake tool, and creates a priority follow-up when needed.

```txt
caller calls in
-> workflow greets them
-> workflow checks whether this is an auto claim
-> workflow triages safety and urgency
-> workflow collects claim details
-> workflow calls a backend tool
-> workflow gives the caller a reference number
-> workflow saves structured insights for review
```

## Start Here

1. Read the plain-English walkthrough: [docs/build-the-workflow.md](docs/build-the-workflow.md)
2. Start the mock claim API:

   ```bash
   npm install
   cp .env.example .env
   CLAIM_TOOL_SECRET=dev-secret npm start
   ```

3. Confirm it is running:

   ```bash
   curl -s http://localhost:8787/health
   ```

4. Build the workflow in the Telnyx Portal using [workflows/portal_build_guide.md](workflows/portal_build_guide.md)
5. Run the test calls in [docs/test-the-workflow.md](docs/test-the-workflow.md)

## What To Look At First

If you only open three files, open these:

- [docs/build-the-workflow.md](docs/build-the-workflow.md): the beginner-friendly tutorial
- [workflows/auto_claim_intake_workflow.json](workflows/auto_claim_intake_workflow.json): the workflow blueprint
- [api/mock_claim_api.mjs](api/mock_claim_api.mjs): the tiny backend used by the workflow tools

## Project Map

```txt
docs/
  build-the-workflow.md     beginner tutorial
  how-it-works.md           architecture explanation
  test-the-workflow.md      test call checklist

workflows/
  auto_claim_intake_workflow.json   workflow blueprint
  portal_build_guide.md             Telnyx Portal build map

api/
  mock_claim_api.mjs        local backend for workflow tool calls

automation/
  tool_contracts.md         request and response shapes for each tool
  zapier_make_mapping.md    mapping insights to a sheet or tracker

schemas/
  conversation_insights_schema.json structured call summary schema

outputs/
  auto_claim_intake_summaries.csv   generated QA sheet template
  setup_checklist.csv               generated setup checklist
```

## Requirements

- Node.js 20 or newer
- A Telnyx account
- Access to Telnyx Conversational Workflows
- An inbound voice-capable Telnyx phone number
- A public HTTPS tunnel or deployed URL for the mock API

For local testing, a tunnel such as ngrok can forward Telnyx tool calls to `http://localhost:8787`.

## Useful Commands

Install dependencies:

```bash
npm install
```

Run the mock API:

```bash
CLAIM_TOOL_SECRET=dev-secret npm start
```

Validate the workflow blueprint:

```bash
npm run validate:workflow
```

Generate CSV templates for QA:

```bash
npm run build:templates
```

## The Three Tool Calls

The workflow uses three backend tools:

- `create_claim_intake`: creates a mock claim intake record
- `log_claim_intake_fallback`: records incomplete, misdirected, or failed intakes
- `flag_priority_follow_up`: creates a priority follow-up task for urgent cases

The detailed request and response contracts are in [automation/tool_contracts.md](automation/tool_contracts.md).

## Learning Goal

After working through this cookbook, you should understand how to turn a business process into a conversational workflow:

- define the happy path
- add branches for unclear or unsupported callers
- collect only the fields needed at each step
- call tools only after the workflow has enough information
- create fallbacks for incomplete information or tool failures
- capture structured insights so humans can review what happened
