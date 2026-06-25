# zapier or make mapping

## trigger

use the telnyx conversation insights webhook as the trigger. if the automation platform asks for a sample payload, place one complete test call through the assistant after insights are enabled.

## destination

append a row to the `auto claim intake summaries` Google Sheet, or map the same fields into a claims qa tracker.

## sheet columns

| google sheet column | telnyx insight field |
| --- | --- |
| timestamp | timestamp |
| claim_intake_id | claim_intake_id |
| fallback_reference_id | fallback_reference_id |
| priority_task_id | priority_task_id |
| tool_status | tool_status |
| caller_name | caller_name |
| caller_phone | caller_phone |
| caller_email | caller_email |
| policy_number | policy_number |
| policyholder_name | policyholder_name |
| caller_relationship | caller_relationship |
| loss_type | loss_type |
| loss_date | loss_date |
| loss_location | loss_location |
| loss_description | loss_description |
| vehicle_year_make_model | vehicle_year_make_model |
| vehicle_drivable | vehicle_drivable |
| injuries_reported | injuries_reported |
| police_report_filed | police_report_filed |
| police_agency | police_agency |
| police_report_number | police_report_number |
| other_parties | other_parties |
| witnesses | witnesses |
| photos_available | photos_available |
| preferred_follow_up_time | preferred_follow_up_time |
| priority_flag | priority_flag |
| priority_reasons | priority_reasons |
| handoff_reason | handoff_reason |
| unresolved_items | unresolved_items |
| summary | summary |
| telnyx_conversation_id | telnyx_conversation_id |
| call_control_id | call_control_id |

## normalization

- if `priority_flag` is true, write `yes`; otherwise write `no`.
- if a field is missing, write a blank value rather than `null`.
- keep the timestamp from telnyx if present. if not present, use the automation platform trigger time.
- keep phone numbers and policy numbers as text so leading `+` signs and leading zeroes are preserved.
- write `tool_status` as one of `created`, `fallback_logged`, `partial`, `failed`, or `unknown`.

## zapier outline

1. trigger: webhooks by zapier, catch hook.
2. action: formatter by zapier, optional only if nested fields need flattening.
3. action: google sheets, create spreadsheet row.
4. map each field according to the table above.
5. turn the zap on after a successful test row is created.

## make outline

1. trigger: custom webhook.
2. action: google sheets, add a row.
3. map each field according to the table above.
4. use a simple text transform for `priority_flag` if needed.
5. activate the scenario after a successful test row is created.
