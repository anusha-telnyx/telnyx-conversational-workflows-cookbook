import fs from "node:fs/promises";
import path from "node:path";
import { projectDir } from "./paths.mjs";

const outputDir = path.join(projectDir, "outputs");
const summaryPath = path.join(outputDir, "auto_claim_intake_summaries.csv");
const checklistPath = path.join(outputDir, "setup_checklist.csv");

const headers = [
  "timestamp",
  "claim_intake_id",
  "fallback_reference_id",
  "priority_task_id",
  "tool_status",
  "caller_name",
  "caller_phone",
  "caller_email",
  "policy_number",
  "policyholder_name",
  "caller_relationship",
  "loss_type",
  "loss_date",
  "loss_location",
  "loss_description",
  "vehicle_year_make_model",
  "vehicle_drivable",
  "injuries_reported",
  "police_report_filed",
  "police_agency",
  "police_report_number",
  "other_parties",
  "witnesses",
  "photos_available",
  "preferred_follow_up_time",
  "priority_flag",
  "priority_reasons",
  "handoff_reason",
  "unresolved_items",
  "summary",
  "telnyx_conversation_id",
  "call_control_id"
];

const exampleRow = [
  "2026-06-15T18:30:00Z",
  "aci_example123456",
  "",
  "",
  "created",
  "jane sample",
  "+15551234567",
  "jane@example.com",
  "pa1234567",
  "jane sample",
  "policyholder",
  "auto",
  "2026-06-15",
  "mission street and 5th street, san francisco",
  "caller reported being rear-ended while stopped at a light",
  "2021 toyota camry",
  "yes",
  "no",
  "no",
  "",
  "",
  "other driver provided name and phone but insurer unknown",
  "none reported",
  "yes",
  "tomorrow morning",
  "no",
  "",
  "",
  "claims team should verify coverage and other party details",
  "jane reported a new auto claim after being rear-ended. the assistant collected caller, policy, vehicle, loss, other party, and follow-up details and created an intake record.",
  "example-conversation-id",
  "example-call-control-id"
];

const checklistRows = [
  ["step", "owner", "status", "notes"],
  ["create telnyx account", "business", "not started", "required before phone number purchase"],
  ["buy inbound telnyx number", "business", "not started", "must support inbound voice"],
  ["start or deploy mock claim api", "technical", "not started", "use api/mock_claim_api.mjs"],
  ["create conversational workflow", "business", "not started", "name: auto claim intake conversational workflow"],
  ["configure voice", "business", "not started", "voice ultra katie"],
  ["upload faq", "business", "not started", "use completed faq/faq_template.md if knowledge is enabled"],
  ["configure live tools", "technical", "not started", "use automation/tool_contracts.md"],
  ["enable insights", "business", "not started", "use schemas/conversation_insights_schema.json"],
  ["connect insights webhook", "technical", "not started", "zapier, make, or qa endpoint"],
  ["map sheet fields", "business", "not started", "use automation/zapier_make_mapping.md"],
  ["run manual tests", "business", "not started", "use tests/manual_test_plan.md"]
];

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(summaryPath, toCsv([headers, exampleRow]), "utf8");
await fs.writeFile(checklistPath, toCsv(checklistRows), "utf8");

console.log(`saved ${summaryPath}`);
console.log(`saved ${checklistPath}`);

function toCsv(rows) {
  return `${rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n")}\n`;
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}
