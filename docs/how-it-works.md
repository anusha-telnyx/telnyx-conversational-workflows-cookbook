# How It Works

This cookbook shows how to build an inbound Telnyx Conversational Workflow for auto insurance first notice of loss intake.

The workflow source of truth is `workflows/auto_claim_intake_workflow.json`. The Portal mapping is documented in `workflows/portal_build_guide.md`.

## Call Flow

```txt
inbound call
-> greet caller
-> classify new auto claim, non-auto, or unclear intent
-> triage safety and urgent cases
-> collect caller, policy, loss, vehicle, and incident details
-> check minimum required fields
-> create claim intake or log fallback
-> flag priority follow-up when needed
-> close with the claim or fallback reference
```

## Workflow Responsibilities

The workflow handles the conversation state:

- ask one question at a time
- accept unknown details when the caller does not know an answer
- route non-auto callers out of the FNOL path
- mark injury, emergency, unsafe vehicle, and unclear safety cases as priority
- avoid promises about coverage, liability, payment, towing, repairs, legal advice, medical advice, or settlement timing

## Tool Responsibilities

The mock API in `api/mock_claim_api.mjs` gives the workflow three live tool endpoints:

- `POST /tools/create-claim-intake`
- `POST /tools/log-claim-intake-fallback`
- `POST /tools/flag-priority-follow-up`

All tool calls require the `x-tool-secret` header. Set the matching local secret with `CLAIM_TOOL_SECRET`.

## Data Capture

The workflow captures claim and caller fields into workflow variables, then stores the result in one of two paths:

- a successful intake with `claim_intake_id`
- a fallback record with `fallback_reference_id`

Urgent cases also receive `priority_task_id`.

Conversation insights should follow `schemas/conversation_insights_schema.json`, and the downstream sheet or tracker mapping is documented in `automation/zapier_make_mapping.md`.

## Validation

Run:

```bash
npm run validate:workflow
```

This validates the workflow graph has an entry node, node IDs are unique, referenced `next` nodes exist, tool nodes reference configured tools, and required minimum fields are present in the collection model.
