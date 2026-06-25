import http from "node:http";
import { randomUUID } from "node:crypto";

const port = Number(process.env.PORT || 8787);
const toolSecret = process.env.CLAIM_TOOL_SECRET || "dev-secret";

const requiredCreateFields = [
  "caller_name",
  "caller_phone",
  "loss_type",
  "loss_date",
  "loss_location",
  "loss_description",
  "priority_flag",
  "consent_to_continue"
];

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(body, null, 2));
}

function makeId(prefix) {
  return `${prefix}_${randomUUID().replaceAll("-", "").slice(0, 16)}`;
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function hasValue(value) {
  if (typeof value === "boolean") {
    return true;
  }

  if (value === null || value === undefined) {
    return false;
  }

  return String(value).trim() !== "";
}

function validateRequired(body, fields) {
  return fields.filter((field) => !hasValue(body[field]));
}

function normalizePriorityReasons(value) {
  if (Array.isArray(value)) {
    return value.filter(hasValue).map(String);
  }

  if (!hasValue(value)) {
    return [];
  }

  return [String(value)];
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { ok: true, service: "mock_claim_api" });
      return;
    }

    if (request.method !== "POST" || !url.pathname.startsWith("/tools/")) {
      sendJson(response, 404, { success: false, error: "not_found" });
      return;
    }

    if (request.headers["x-tool-secret"] !== toolSecret) {
      sendJson(response, 401, { success: false, error: "unauthorized" });
      return;
    }

    const body = await readJson(request);

    if (url.pathname === "/tools/create-claim-intake") {
      const missingFields = validateRequired(body, requiredCreateFields);

      if (missingFields.length > 0) {
        sendJson(response, 422, {
          success: false,
          error: "missing_required_fields",
          missing_fields: missingFields
        });
        return;
      }

      const priorityFlag = Boolean(body.priority_flag);
      sendJson(response, 200, {
        success: true,
        claim_intake_id: makeId("aci"),
        priority_flag: priorityFlag,
        next_step: "claims team follow-up"
      });
      return;
    }

    if (url.pathname === "/tools/log-claim-intake-fallback") {
      const missingFields = validateRequired(body, ["reason", "summary"]);

      if (missingFields.length > 0) {
        sendJson(response, 422, {
          success: false,
          error: "missing_required_fields",
          missing_fields: missingFields
        });
        return;
      }

      sendJson(response, 200, {
        success: true,
        fallback_reference_id: makeId("acf"),
        next_step: "claims team manual review"
      });
      return;
    }

    if (url.pathname === "/tools/flag-priority-follow-up") {
      const hasClaimReference = hasValue(body.claim_intake_id) || hasValue(body.fallback_reference_id);
      const missingFields = validateRequired(body, ["caller_phone"]);

      if (!hasClaimReference) {
        missingFields.unshift("claim_intake_id_or_fallback_reference_id");
      }

      if (missingFields.length > 0) {
        sendJson(response, 422, {
          success: false,
          error: "missing_required_fields",
          missing_fields: missingFields
        });
        return;
      }

      sendJson(response, 200, {
        success: true,
        priority_task_id: makeId("apt"),
        priority_status: "queued",
        priority_reasons: normalizePriorityReasons(body.priority_reasons)
      });
      return;
    }

    sendJson(response, 404, { success: false, error: "unknown_tool" });
  } catch (error) {
    const isJsonError = error instanceof SyntaxError;
    sendJson(response, isJsonError ? 400 : 500, {
      success: false,
      error: isJsonError ? "invalid_json" : "internal_error"
    });
  }
});

server.listen(port, () => {
  console.log(`mock claim api listening on http://localhost:${port}`);
});
