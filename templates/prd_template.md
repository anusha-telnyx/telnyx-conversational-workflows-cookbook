# prd template

use this template before creating or changing workflow, prompt, schema, api, automation, or testing artifacts. every contributor should be able to read this document and understand what to build, what not to build, how success will be measured, and which files must change.

## document control

| field | value |
| --- | --- |
| product / workflow name |  |
| prd owner |  |
| primary contributors |  |
| reviewers / approvers |  |
| status | draft / in review / approved / implemented |
| target release or demo date |  |
| last updated |  |
| related tickets / docs |  |

## contributor requirements

every contributor must satisfy these requirements before requesting review.

- keep this prd updated as scope, requirements, or file ownership changes.
- document all required artifacts in the checklist below, including items that are intentionally marked `n/a`.
- include clear acceptance criteria for each must-have requirement.
- run the validation commands listed in this prd or explain why a command is not applicable.
- attach or link review evidence, such as transcripts, screenshots, logs, generated files, or test notes.
- do not add secrets, credentials, private customer data, or unapproved regulated content to the repo.
- request review from the listed owners before launch, demo, or handoff.

## 1. summary

write a short description of the product, workflow, or change.

- what is being built: 
- who it is for:
- why now:
- expected outcome:

## 2. problem statement

describe the user, business, or operational problem this work solves.

- current state:
- pain points:
- impact if not solved:
- evidence or examples:

## 3. goals and non-goals

### goals

- 
- 
- 

### non-goals

- 
- 
- 

## 4. users and stakeholders

| role | need / responsibility | notes |
| --- | --- | --- |
| end user / caller |  |  |
| business owner |  |  |
| operations / support |  |  |
| engineering contributor |  |  |
| qa / reviewer |  |  |

## 5. scope

### in scope

- 
- 
- 

### out of scope

- 
- 
- 

## 6. user experience and workflow behavior

describe the expected user journey. for voice or conversational workflows, include the first message, decision points, handoff behavior, fallback behavior, and any statements the system must avoid.

### primary flow

1. 
2. 
3. 

### alternate flows

| scenario | expected behavior | required artifact updates |
| --- | --- | --- |
|  |  |  |
|  |  |  |

### fallback and error handling

- missing information:
- tool or api failure:
- unsafe or urgent situation:
- unsupported user request:
- human handoff or follow-up:

## 7. requirements

### functional requirements

| id | requirement | priority | owner | acceptance criteria |
| --- | --- | --- | --- | --- |
| fr-001 |  | must / should / could |  |  |
| fr-002 |  | must / should / could |  |  |
| fr-003 |  | must / should / could |  |  |

### data and schema requirements

| field / object | required | source | destination | validation rules |
| --- | --- | --- | --- | --- |
|  | yes / no |  |  |  |
|  | yes / no |  |  |  |

### integration and tool requirements

| tool / endpoint / automation | trigger | request inputs | expected response | failure behavior |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
|  |  |  |  |  |

### prompt and knowledge requirements

- greeting or first message:
- system / assistant prompt changes:
- approved faq or knowledge source changes:
- prohibited claims or statements:
- tone and style requirements:

### security, privacy, and compliance requirements

- sensitive data collected:
- data that must not be collected:
- authentication / secret handling:
- retention or logging expectations:
- compliance review required: yes / no

## 8. contributor artifact checklist

complete this checklist before requesting review. mark non-applicable items as `n/a` and explain why.

| artifact | required? | expected file path | owner | status |
| --- | --- | --- | --- | --- |
| prd | yes | `templates/prd_template.md` copied into the feature docs location |  |  |
| workflow definition | yes / no | `workflows/` |  |  |
| portal build guide | yes / no | `workflows/` |  |  |
| assistant or workflow prompt | yes / no | `prompts/` |  |  |
| greeting | yes / no | `prompts/greeting.txt` |  |  |
| faq / knowledge base | yes / no | `faq/` |  |  |
| api or mock tool | yes / no | `api/` |  |  |
| tool contract docs | yes / no | `automation/` |  |  |
| schema | yes / no | `schemas/` |  |  |
| automation mapping | yes / no | `automation/` |  |  |
| CSV or output template | yes / no | `outputs/` |  |  |
| manual test plan | yes / no | `tests/` |  |  |
| readme update | yes / no | `README.md` |  |  |

## 9. acceptance criteria

define the conditions that must be true before the work is accepted.

- 
- 
- 

## 10. test plan

| test scenario | steps | expected result | evidence required |
| --- | --- | --- | --- |
| happy path |  |  | transcript / screenshot / log / output file |
| fallback path |  |  | transcript / screenshot / log / output file |
| edge case |  |  | transcript / screenshot / log / output file |

### validation commands

list any commands contributors should run before review.

```bash
npm run validate:workflow
npm run build:templates
```

## 11. dependencies and assumptions

### dependencies

- 
- 
- 

### assumptions

- 
- 
- 

## 12. risks and mitigations

| risk | impact | likelihood | mitigation | owner |
| --- | --- | --- | --- | --- |
|  | low / medium / high | low / medium / high |  |  |
|  | low / medium / high | low / medium / high |  |  |

## 13. open questions

| question | owner | decision needed by | status |
| --- | --- | --- | --- |
|  |  |  | open |
|  |  |  | open |

## 14. launch and rollback plan

- launch steps:
- monitoring or qa checks:
- rollback steps:
- owner on call or responsible reviewer:

## 15. review and signoff

| reviewer | area | approval status | date |
| --- | --- | --- | --- |
|  | product / business | pending |  |
|  | engineering | pending |  |
|  | qa | pending |  |
|  | compliance / legal if needed | pending |  |

## definition of ready

- problem, goals, non-goals, and scope are clear.
- required artifacts and owners are identified.
- functional, data, integration, prompt, and compliance requirements are documented.
- open questions have owners and decision dates.
- reviewers know what evidence they need to approve the work.

## definition of done

- all required artifacts are created or updated.
- acceptance criteria are met.
- validation commands and manual tests have been run or explicitly marked `n/a`.
- evidence is attached or linked.
- reviewers have signed off.
- README or contributor-facing docs are updated if the workflow changed.
