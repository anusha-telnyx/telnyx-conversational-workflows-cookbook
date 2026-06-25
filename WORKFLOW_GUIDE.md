# Build The Workflow

Use this guide as the learning path. Build the happy path first, then add the branches.

## 1. Start With The Goal

The caller wants to report a new auto claim.

The workflow should collect enough information for the claims team to follow up. It should not promise coverage, payment, liability, repairs, legal advice, medical advice, or settlement timing.

## 2. Create The Workflow

In the Telnyx Portal:

1. Go to Conversational Workflows.
2. Create a new workflow.
3. Name it `auto claim intake conversational workflow`.
4. Set the first message:

   ```txt
   hi, thanks for calling claims intake. are you calling to report a new auto claim
   ```

5. Use `voice ultra katie`, or choose another voice you prefer.

## 3. Build The Happy Path

Create these nodes in order:

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

This is the normal successful call.

## 4. Ask Whether This Is An Auto Claim

At `classify_intent`, branch into three paths:

- new auto claim: continue to `safety_triage`
- not an auto claim: collect callback details and log a fallback
- unclear: ask a clarifying question, then classify again

## 5. Triage Safety Early

Ask:

```txt
before we continue, is anyone injured, in immediate danger, or needing emergency help
```

If the caller says yes or is unsure:

- set `priority_flag` to `true`
- add a priority reason
- remind the caller to contact emergency services if needed
- continue only if they can safely proceed

## 6. Collect Details In Small Groups

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

## 7. Call A Tool Only When Ready

Before calling `create_claim_intake`, make sure you have:

- caller name
- caller phone
- loss type
- loss date
- loss location
- loss description
- priority flag
- consent to continue

If the workflow does not have enough information, call `log_claim_intake_fallback` instead.

## 8. Connect The Mock API

Run the local API:

```bash
CLAIM_TOOL_SECRET=dev-secret npm start
```

Expose it with a public HTTPS tunnel, then configure these Telnyx workflow tools:

```txt
POST /tools/create-claim-intake
POST /tools/log-claim-intake-fallback
POST /tools/flag-priority-follow-up
```

Each tool should send:

```txt
x-tool-secret: dev-secret
```

The full request and response examples are in [tool-contracts.md](tool-contracts.md).

## 9. Add Priority Follow-Up

After `create_claim_intake`, check `priority_flag`.

If it is `true`, call `flag_priority_follow_up`.

Priority cases include:

- injury reported
- emergency or unsafe situation
- vehicle not drivable
- safety status unclear

## 10. Close The Call

End with one of these:

- a `claim_intake_id`
- a `fallback_reference_id`
- a clear message that the team will follow up

Then run the scenarios in [TEST_PLAN.md](TEST_PLAN.md).

