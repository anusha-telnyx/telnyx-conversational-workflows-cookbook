# telnyx live tool contracts

these endpoints are the v1 mock claim api for telnyx assistant live tool calls. expose them publicly for telnyx with a tunneling service or deployed host, then configure equivalent webhook tools in the telnyx assistant.

## base url

local default:

```text
http://localhost:8787
```

public deployment:

```text
https://your-public-host.example.com
```

## authentication

send the shared secret in this header:

```text
x-tool-secret: your-secret-value
```

set the server secret with:

```text
CLAIM_TOOL_SECRET=your-secret-value
```

## post /tools/create-claim-intake

creates a mock auto first notice of loss intake record.

minimum required fields:

- caller_name
- caller_phone
- loss_type
- loss_date
- loss_location
- loss_description
- priority_flag
- consent_to_continue

example request:

```json
{
  "caller_name": "jane sample",
  "caller_phone": "+15551234567",
  "caller_email": "jane@example.com",
  "policy_number": "pa1234567",
  "loss_type": "auto",
  "loss_date": "2026-06-15",
  "loss_location": "mission street and 5th street, san francisco",
  "loss_description": "rear-ended at a stop light",
  "vehicle_year_make_model": "2021 toyota camry",
  "vehicle_drivable": "yes",
  "injuries_reported": "no",
  "police_report_filed": "no",
  "photos_available": "yes",
  "preferred_follow_up_time": "tomorrow morning",
  "priority_flag": false,
  "priority_reasons": "",
  "consent_to_continue": true,
  "unresolved_items": "claims team should verify coverage"
}
```

success response:

```json
{
  "success": true,
  "claim_intake_id": "aci_...",
  "priority_flag": false,
  "next_step": "claims team follow-up"
}
```

## post /tools/log-claim-intake-fallback

records a fallback summary when the caller is misdirected, information is too incomplete, or the create tool fails.

example request:

```json
{
  "caller_name": "jane sample",
  "caller_phone": "+15551234567",
  "reason": "tool_failure",
  "collected_fields": {
    "loss_type": "auto",
    "loss_description": "rear-ended at a stop light"
  },
  "summary": "caller reported an auto loss but the primary create tool failed"
}
```

success response:

```json
{
  "success": true,
  "fallback_reference_id": "acf_...",
  "next_step": "claims team manual review"
}
```

## post /tools/flag-priority-follow-up

creates a mock priority follow-up task for urgent cases after an intake or fallback record exists.

example request:

```json
{
  "claim_intake_id": "aci_123",
  "caller_phone": "+15551234567",
  "priority_reasons": ["injury_reported", "vehicle_not_drivable"]
}
```

success response:

```json
{
  "success": true,
  "priority_task_id": "apt_...",
  "priority_status": "queued"
}
```
