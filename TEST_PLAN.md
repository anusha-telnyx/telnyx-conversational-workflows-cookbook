# Test The Workflow

Use these calls after the workflow is built in Telnyx and the mock API is reachable from a public HTTPS URL.

## Preflight

Confirm:

- the workflow is named `auto claim intake conversational workflow`
- the voice is `voice ultra katie`
- the first message asks whether the caller is reporting a new auto claim
- the mock API is running
- all three tools include the `x-tool-secret` header
- conversation insights are enabled
- the inbound phone number is assigned to the workflow

## Test 1: Clean Auto Claim

Call the number and report a rear-end accident.

Give complete caller, policy, vehicle, location, date, and other-party details. Say there are no injuries and the car is drivable.

Expected result:

- the workflow asks one question at a time
- `create_claim_intake` is called
- the caller receives a `claim_intake_id`
- `priority_flag` is `false`

## Test 2: Injury Reported

Call and report that someone may be injured.

Expected result:

- the workflow tells the caller to contact emergency services if needed
- the workflow only continues after the caller can safely proceed
- `create_claim_intake` is called
- `flag_priority_follow_up` is called
- `priority_flag` is `true`

## Test 3: Vehicle Not Drivable

Call and say the vehicle is not safe to drive.

Expected result:

- the workflow captures the vehicle status and location
- it does not promise towing coverage
- it creates a claim intake
- it creates a priority follow-up

## Test 4: Missing Policy Number

Call and provide your name and phone number, but say you do not have the policy number.

Expected result:

- the workflow continues
- `policy_number` is blank
- `unresolved_items` notes that the claims team should verify policy details
- the workflow does not imply coverage was verified

## Test 5: Human Request

Call and ask to speak with a representative.

Expected result:

- the workflow does not pretend to transfer the call
- it collects callback details
- it creates an intake or fallback record
- `handoff_reason` is `requested_human`

## Test 6: Tool Failure

Temporarily use the wrong tool secret or stop the mock API.

Expected result:

- the workflow does not say the claim was created
- it uses `log_claim_intake_fallback` if available
- if tools are unavailable, it says the team will follow up based on the collected information

## Test 7: Non-Auto Caller

Call about homeowners, health, billing, or a general policy question.

Expected result:

- the workflow does not force the auto-claim path
- it collects callback information
- it logs a fallback record
- `handoff_reason` is `non_auto_or_misdirected`

