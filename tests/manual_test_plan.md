# manual test plan

## preflight

- telnyx conversational workflow exists and is named `auto claim intake conversational workflow`.
- voice is configured as `voice ultra katie`.
- greeting says: `hi, thanks for calling claims intake. are you calling to report a new auto claim`.
- approved faq is uploaded as the workflow knowledge source.
- inbound telnyx phone number is assigned to the workflow.
- mock claim api is publicly reachable.
- all three live tools are configured with the `x-tool-secret` header.
- conversation insights are enabled with `schemas/conversation_insights_schema.json`.
- insights webhook is connected to zapier, make, or the qa destination.
- google sheet exists with the expected columns if using sheet-based qa.

## test 1: clean auto fnol

call the telnyx number and report a rear-end accident with full caller, policy, vehicle, location, date, and other party details. say there are no injuries and the car is drivable.

expected result:

- workflow asks one question at a time.
- workflow calls `create_claim_intake`.
- workflow gives the caller a `claim_intake_id`.
- `priority_flag` is `false`.
- insights row has `tool_status` as `created`.

## test 2: injury reported

call and report an auto accident where one person may be injured.

expected result:

- workflow tells caller to contact emergency services if needed.
- workflow continues only after the caller can safely proceed.
- workflow calls `create_claim_intake`.
- workflow calls `flag_priority_follow_up`.
- `priority_flag` is `true`.
- `priority_reasons` includes injury.

## test 3: vehicle not drivable

call and report that the vehicle is not safe to drive and is currently at a tow yard or roadside location.

expected result:

- workflow captures the vehicle location and drivable status.
- workflow does not promise towing coverage.
- workflow creates a claim intake record.
- workflow creates a priority follow-up task.

## test 4: missing policy number

call and provide name and phone but say the policy number is not available.

expected result:

- workflow proceeds without policy lookup.
- workflow does not imply coverage verification.
- `policy_number` is blank.
- `unresolved_items` notes that the claims team should verify policy details.

## test 5: human request

call and ask to speak with a representative.

expected result:

- workflow does not attempt a live transfer.
- workflow collects a message and minimum callback details.
- workflow creates an intake if enough claim facts are provided, otherwise uses `log_claim_intake_fallback`.
- `handoff_reason` is `requested_human`.

## test 6: create tool failure

temporarily configure an incorrect tool secret or stop the mock api, then place a call with enough claim details.

expected result:

- workflow does not claim the record was created.
- workflow uses `log_claim_intake_fallback` if available.
- if all tools are unavailable, the workflow clearly says the team will follow up based on the collected information.
- insights row has `tool_status` as `fallback_logged` or `failed`.

## test 7: partial information

call and only provide first name, phone number, a rough loss date, and a brief loss description.

expected result:

- workflow accepts unknown details.
- workflow collects all available minimum fields.
- workflow creates an intake or fallback record.
- `unresolved_items` lists missing claim details.

## test 8: non-auto or misdirected caller

call about a homeowners, health, billing, or general policy question.

expected result:

- workflow does not force the auto fnol flow.
- workflow collects caller name, callback phone, reason, and preferred follow-up time.
- workflow uses `log_claim_intake_fallback`.
- `handoff_reason` is `non_auto_or_misdirected`.

## test 9: coverage, liability, or payment question

call and ask whether the loss is covered, who is at fault, or how much will be paid.

expected result:

- workflow refuses to make the decision.
- workflow says the claims team must review the claim.
- workflow collects the question in `unresolved_items`.
- no unsupported promises appear in the transcript.

## test 10: conversation history check

open telnyx conversation history for each test call.

expected result:

- transcript matches the caller flow.
- tool call results match the workflow spoken claim or fallback reference.
- generated insights match the google sheet row.
- no unsupported coverage, liability, payment, legal, or medical claims appear.
