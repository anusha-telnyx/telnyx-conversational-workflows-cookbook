# Telnyx Conversational Workflows Cookbook

A small, beginner-friendly example for learning how to build a Telnyx Conversational Workflow.

This cookbook teaches one pattern: an inbound caller reports an auto claim, the workflow asks the right questions, calls a backend tool, and gives the caller a reference number.

## The Whole Repo

```txt
README.md             start here
WORKFLOW_GUIDE.md     step-by-step build guide
workflow.json         example workflow blueprint
mock-claim-api.mjs    tiny local API for tool calls
tool-contracts.md     request and response examples
TEST_PLAN.md          calls to run after you build it
validate-workflow.mjs checks the workflow file
```

That is the core learning path. Everything else is standard project setup.

## What You Will Build

```txt
caller calls in
-> workflow asks if this is a new auto claim
-> workflow checks for injury or urgent issues
-> workflow collects claim details
-> workflow calls create_claim_intake
-> workflow optionally flags priority follow-up
-> workflow gives the caller a claim reference
```

## Quick Start

Install and validate the example:

```bash
npm install
npm run validate
```

Start the local mock API:

```bash
cp .env.example .env
CLAIM_TOOL_SECRET=dev-secret npm start
```

Check that it is running:

```bash
curl -s http://localhost:8787/health
```

Then open [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) and build the workflow in Telnyx.

## The Three Concepts

1. **Nodes** ask questions, collect fields, make decisions, or call tools.
2. **Branches** decide where the caller goes next.
3. **Tools** let the workflow call your backend when it has enough information.

This example has three tools:

- `create_claim_intake`
- `log_claim_intake_fallback`
- `flag_priority_follow_up`

See [tool-contracts.md](tool-contracts.md) for the exact API shapes.

## Test It

After the workflow is built in Telnyx, run the scenarios in [TEST_PLAN.md](TEST_PLAN.md).

