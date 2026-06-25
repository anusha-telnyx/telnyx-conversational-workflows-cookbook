# telnyx conversational workflow build guide

this demo should be built in telnyx as a conversational workflow, not as a standalone ai assistant prompt.

use `workflows/auto_claim_intake_workflow.json` as the source of truth for nodes, branches, variables, and tool calls.

## workflow identity

- workflow name: `auto claim intake conversational workflow`
- channel: inbound voice
- voice: `voice ultra katie`
- first message: `hi, thanks for calling claims intake. are you calling to report a new auto claim`

## node map

| node id | workflow node type | purpose |
| --- | --- | --- |
| `start` | message | greet caller and ask whether this is a new auto claim |
| `classify_intent` | decision | route auto claim, non-auto caller, or unclear intent |
| `clarify_auto_claim` | question | ask a follow-up when intent is unclear |
| `non_auto_capture` | collect fields | capture callback information for non-auto callers |
| `fallback_non_auto` | tool call | log non-auto or misdirected caller |
| `safety_triage` | question plus decision | detect injury, emergency, or unsafe situation |
| `emergency_guidance` | message plus decision | advise emergency services if needed and confirm caller can continue |
| `collect_caller_details` | collect fields | collect caller and policy-related details |
| `collect_loss_details` | collect fields plus decision | collect loss and vehicle details, flag undrivable vehicle |
| `collect_incident_details` | collect fields | collect injuries, police, other parties, witnesses, photos, and follow-up preferences |
| `minimum_field_check` | decision | choose claim creation, partial fallback, or human request fallback |
| `create_claim_intake` | tool call | call the mock claim creation endpoint |
| `priority_check` | decision | route urgent cases to priority follow-up |
| `flag_priority_follow_up` | tool call | create a priority follow-up task |
| fallback nodes | tool call | log partial, human request, emergency, or tool failure |
| close nodes | message | summarize outcome and end politely |

## decision branches

### classify intent

- auto claim -> `safety_triage`
- non-auto or misdirected -> `non_auto_capture`
- unclear -> `clarify_auto_claim`

### safety triage

- injury or immediate danger -> set `priority_flag = true`, add `injury_or_emergency_reported`, go to `emergency_guidance`
- no injury or danger -> `collect_caller_details`
- unsure -> set `priority_flag = true`, add `safety_unclear`, go to `emergency_guidance`

### loss details

- vehicle not drivable or unsafe -> set `priority_flag = true`, add `vehicle_not_drivable`, continue to incident details
- vehicle drivable or unknown -> continue to incident details

### minimum field check

- minimum fields present -> `create_claim_intake`
- minimum fields missing and caller cannot provide them -> `fallback_partial`
- caller asks for a person -> `fallback_human_request`

### priority check

- `priority_flag = true` -> `flag_priority_follow_up`
- `priority_flag = false` -> `confirm_and_close`

## workflow variables

create workflow variables for:

- `claim_intake_id`
- `fallback_reference_id`
- `priority_task_id`
- `priority_flag`
- `priority_reasons`
- `handoff_reason`
- `tool_status`

collect these caller and claim fields:

- `caller_name`
- `caller_phone`
- `caller_email`
- `policy_number`
- `policyholder_name`
- `caller_relationship`
- `loss_type`
- `loss_date`
- `loss_location`
- `loss_description`
- `vehicle_year_make_model`
- `vehicle_drivable`
- `injuries_reported`
- `police_report_filed`
- `police_agency`
- `police_report_number`
- `other_parties`
- `witnesses`
- `photos_available`
- `preferred_follow_up_time`
- `unresolved_items`

minimum required fields before claim creation:

- `caller_name`
- `caller_phone`
- `loss_type`
- `loss_date`
- `loss_location`
- `loss_description`
- `priority_flag`
- `consent_to_continue`

## tool setup

use the live tool contracts in `automation/tool_contracts.md`.

configure these workflow tool nodes:

- `create_claim_intake`: `post /tools/create-claim-intake`
- `log_claim_intake_fallback`: `post /tools/log-claim-intake-fallback`
- `flag_priority_follow_up`: `post /tools/flag-priority-follow-up`

each tool should send:

```text
x-tool-secret: your-secret-value
```

use the public base url for the mock claim api. if testing locally, expose the server with a tunnel before connecting telnyx.

## demo script

for the demo, show the workflow canvas and walk through this path:

1. `start`
2. `classify_intent`
3. `safety_triage`
4. `collect_caller_details`
5. `collect_loss_details`
6. `collect_incident_details`
7. `minimum_field_check`
8. `create_claim_intake`
9. `priority_check`
10. `confirm_and_close`

then show an urgent branch:

1. injury reported in `safety_triage`
2. `priority_flag` becomes true
3. `create_claim_intake`
4. `flag_priority_follow_up`
5. close

## important demo distinction

do not present `assistant-42e0a4bf-b1ce-476e-863d-d8fdca6e87dc` as the workflow demo. that is an ai assistant object created during setup. the conversational workflow demo is the node-based flow described in this directory.
