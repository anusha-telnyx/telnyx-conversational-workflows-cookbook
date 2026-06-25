# Build The Workflow

This guide explains the workflow in the order a beginner should build it.

The example is an inbound auto insurance claim intake, but the same pattern works for many business workflows: intake, qualification, scheduling, support triage, lead routing, account updates, and handoffs.

## 1. Start With The Caller Goal

The caller goal is simple:

> I need to report a new auto claim.

The workflow goal is also simple:

> Collect enough information for the claims team to follow up, without making promises about coverage, payment, liability, repairs, legal advice, or medical advice.

That goal keeps the workflow focused. It does not try to fully settle a claim. It only collects and routes the intake.

## 2. Draw The Happy Path

Start with the most common successful call:

```txt
start
-> classify_intent
-> safety_triage
-> collect_caller_details
-> collect_loss_details
-> collect_incident_details
-> minimum_field_check
-> create_claim_intake
-> priority_check
-> confirm_and_close
```

This is the path to build first in the Telnyx Portal.

Do not start with every edge case. Build the happy path first, then add branches.

## 3. Add The First Question

The first message is:

```txt
hi, thanks for calling claims intake. are you calling to report a new auto claim
```

That question tells the workflow whether to continue the auto-claim path or route the caller somewhere else.

The first decision has three outcomes:

- yes, this is a new auto claim
- no, this is not a new auto claim
- unclear

## 4. Add Safety Triage Early

Safety comes before normal data collection.

The workflow asks:

```txt
before we continue, is anyone injured, in immediate danger, or needing emergency help
```

If the caller reports an injury, danger, or uncertainty, the workflow sets:

```txt
priority_flag = true
```

It also adds a priority reason, such as:

```txt
injury_or_emergency_reported
```

This does not replace emergency services. The workflow reminds the caller to contact emergency services if needed, then only continues if the caller can safely proceed.

## 5. Collect Fields In Groups

The workflow collects fields in small groups so the call feels natural.

Caller details:

- caller name
- caller phone
- caller email
- policy number
- policyholder name
- caller relationship

Loss details:

- loss date
- loss location
- loss description
- vehicle year, make, and model
- whether the vehicle is drivable

Incident details:

- injuries
- police report
- other parties
- witnesses
- photos
- preferred follow-up time
- unresolved items

## 6. Check Minimum Fields Before Calling A Tool

The workflow should not call the claim-intake tool too early.

Minimum fields are:

- caller name
- caller phone
- loss type
- loss date
- loss location
- loss description
- priority flag
- consent to continue

If those are present, the workflow calls `create_claim_intake`.

If they are missing, the workflow uses `log_claim_intake_fallback` so the team still has a record.

## 7. Add Tool Calls

This cookbook includes a small local API with three endpoints:

```txt
POST /tools/create-claim-intake
POST /tools/log-claim-intake-fallback
POST /tools/flag-priority-follow-up
```

Run it locally:

```bash
CLAIM_TOOL_SECRET=dev-secret npm start
```

Expose it with a public HTTPS tunnel before connecting it to Telnyx.

Each Telnyx tool should send this header:

```txt
x-tool-secret: dev-secret
```

See [../automation/tool_contracts.md](../automation/tool_contracts.md) for the exact request and response bodies.

## 8. Add Priority Follow-Up

After a claim is created, the workflow checks `priority_flag`.

If `priority_flag` is `true`, it calls:

```txt
flag_priority_follow_up
```

Common priority reasons:

- injury reported
- emergency or unsafe situation
- vehicle not drivable
- safety status unclear

## 9. Close The Call Clearly

The caller should leave with one of these:

- a claim intake reference
- a fallback reference
- a clear explanation that the team will follow up

The workflow should not say that coverage is confirmed, payment is approved, repairs are authorized, or liability is decided.

## 10. Build It In Telnyx

Use [../workflows/portal_build_guide.md](../workflows/portal_build_guide.md) as the exact node-by-node build guide.

Use [../workflows/auto_claim_intake_workflow.json](../workflows/auto_claim_intake_workflow.json) as the source of truth if you want to inspect the full graph.

When the workflow is built, run the test calls in [test-the-workflow.md](test-the-workflow.md).

