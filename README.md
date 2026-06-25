# Telnyx Conversational Workflows Cookbook

A small, beginner-friendly example for learning how to build a Telnyx Conversational Workflow.

This cookbook teaches one pattern: an inbound caller reports an auto claim, the workflow asks the right questions, calls a backend tool, and gives the caller a reference number.

## Why This Matters

Many voice AI demos start with a prompt and hope the assistant follows the right path. That can work for open-ended conversations, but business intake calls usually need more structure.

Insurance claim intake is a good example because the caller may be stressed, the company needs specific information, and the workflow must avoid saying the wrong thing. The system should collect facts, route urgent cases, create a record, and leave coverage or liability decisions to the claims team.

That is why this cookbook uses a Conversational Workflow:

- the caller gets a clear, step-by-step experience
- the business controls which questions are asked
- urgent situations can branch early
- backend tools are called only after required fields are collected
- fallback paths are explicit when the caller is not ready or the tool fails

## Why Not Just Use One Big Prompt?

A single assistant prompt can be hard to audit. It may skip required fields, handle edge cases inconsistently, or call a tool before enough information is available.

A workflow makes the process visible. You can point to each node and say:

- what question is asked
- what information is saved
- what branch happens next
- when a tool is allowed to run
- what happens if the call cannot continue

For regulated or operational workflows, that visibility matters.

## Why Insurance?

This walkthrough uses auto insurance first notice of loss because it is easy to understand and has realistic workflow requirements:

- identify whether the caller has the right issue
- triage injury or emergency situations
- collect caller, policy, vehicle, and incident details
- avoid promises about coverage, payment, repairs, liability, legal advice, or medical advice
- create a claim intake record
- flag urgent cases for human follow-up

You can reuse the same pattern for appointment scheduling, support triage, lead qualification, account updates, patient intake, or service dispatch.

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
