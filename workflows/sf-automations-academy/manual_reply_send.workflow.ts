import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : manual_reply_send
// Nodes   : 10  |  Connections: 9
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// VerifyHmac                         code
// IfSignatureOk                      if
// RespondUnauthorized                respondToWebhook
// FetchLead                          postgres                   [creds]
// IfLeadPaused                       if
// RespondConflict                    respondToWebhook
// SendWhatsapp                       whatsAble                  [creds]
// PersistOutboundHuman               postgres                   [creds]
// RespondOk                          respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → VerifyHmac
//      → IfSignatureOk
//        → FetchLead
//          → IfLeadPaused
//            → SendWhatsapp
//              → PersistOutboundHuman
//                → RespondOk
//           .out(1) → RespondConflict
//       .out(1) → RespondUnauthorized
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'HGmeXSAFxAMSRhoq',
    name: 'manual_reply_send',
    active: false,
    isArchived: false,
    projectId: 'dwI6blbSqLHzkWy1',
    settings: { executionOrder: 'v1' },
})
export class ManualReplySendWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'mrs-0001-4000-8000-000000000001',
        webhookId: '47b0464b-ed93-46c1-a282-b0490dfb5df5',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2,
        position: [0, 320],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'manual-reply',
        responseMode: 'responseNode',
        options: {
            rawBody: true,
        },
    };

    @node({
        id: 'mrs-0002-4000-8000-000000000002',
        name: 'Verify HMAC',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [160, 320],
    })
    VerifyHmac = {
        language: 'javaScript',
        jsCode: `// Verify X-Manual-Reply-Signature header against the raw body.
// MANUAL_REPLY_SECRET lives in n8n's "Manual Reply Secret" credential
// (a generic secret credential — see docs/N8N-WORKFLOWS.md).
//
// We expose it via $secrets here through an n8n environment variable
// pattern: the secret is set as the workflow's static data on activation,
// or read from a Credentials access. For the dev placeholder we read
// from \`process.env.MANUAL_REPLY_SECRET\` — replace in Phase B with the
// credential reference.
const crypto = require('crypto');

const rawBody = $input.first().binary?.body?.data
  ? Buffer.from($input.first().binary.body.data, 'base64').toString('utf8')
  : JSON.stringify($input.first().json.body ?? $input.first().json);

const headers = $input.first().json.headers ?? {};
const signatureHeader =
  headers['x-manual-reply-signature'] || headers['X-Manual-Reply-Signature'] || '';
const expectedHex = signatureHeader.replace(/^sha256=/, '');

// In Phase B, replace process.env access with $vars.manual_reply_secret
// once the Variables credential is configured.
const secret = process.env.MANUAL_REPLY_SECRET || $vars?.manual_reply_secret || '';
if (!secret) {
  return [{ json: { ok: false, status: 500, error: 'MANUAL_REPLY_SECRET not configured' } }];
}

const expected = crypto
  .createHmac('sha256', secret)
  .update(rawBody, 'utf8')
  .digest('hex');

const ok =
  expectedHex.length === expected.length &&
  crypto.timingSafeEqual(Buffer.from(expectedHex, 'hex'), Buffer.from(expected, 'hex'));

if (!ok) {
  return [{ json: { ok: false, status: 401, error: 'Bad signature' } }];
}

// Parse body for downstream use.
let body;
try {
  body = JSON.parse(rawBody);
} catch (e) {
  return [{ json: { ok: false, status: 400, error: 'Body is not valid JSON' } }];
}

const required = ['lead_id', 'user_id', 'message', 'idempotency_key'];
const missing = required.filter((k) => !body[k]);
if (missing.length) {
  return [{ json: { ok: false, status: 400, error: 'Missing fields: ' + missing.join(', ') } }];
}

return [{ json: { ok: true, body } }];`,
    };

    @node({
        id: 'mrs-0003-4000-8000-000000000003',
        name: 'If Signature OK',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [320, 320],
    })
    IfSignatureOk = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 3,
            },
            conditions: [
                {
                    id: 'sig-ok',
                    leftValue: '={{ $json.ok }}',
                    rightValue: '={{ true }}',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'mrs-0004-4000-8000-000000000004',
        name: 'Respond Unauthorized',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.1,
        position: [480, 480],
    })
    RespondUnauthorized = {
        respondWith: 'json',
        responseBody: '={{ { error: $json.error || "Unauthorized" } }}',
        options: {
            responseCode: '={{ $json.status || 401 }}',
        },
    };

    @node({
        id: 'mrs-0005-4000-8000-000000000005',
        name: 'Fetch Lead',
        type: 'n8n-nodes-base.postgres',
        version: 2.6,
        position: [480, 160],
        credentials: { postgres: { id: '<NEON_CRED_ID>', name: 'Neon — Dorra' } },
    })
    FetchLead = {
        operation: 'executeQuery',
        query: 'SELECT id, phone_e164, agent_paused FROM leads WHERE id = $1::uuid LIMIT 1',
        options: {
            queryReplacement: '={{ $json.body.lead_id }}',
        },
    };

    @node({
        id: 'mrs-0006-4000-8000-000000000006',
        name: 'If Lead Paused',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [640, 160],
    })
    IfLeadPaused = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 3,
            },
            conditions: [
                {
                    id: 'paused-check',
                    leftValue: '={{ $json.agent_paused }}',
                    rightValue: '={{ true }}',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'mrs-0007-4000-8000-000000000007',
        name: 'Respond Conflict',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.1,
        position: [800, 320],
    })
    RespondConflict = {
        respondWith: 'json',
        responseBody: '={{ { error: "Lead is not paused — set agent_paused = true before sending a manual reply." } }}',
        options: {
            responseCode: 409,
        },
    };

    @node({
        id: 'mrs-0008-4000-8000-000000000008',
        name: 'Send WhatsApp',
        type: 'n8n-nodes-whatsable.whatsAble',
        version: 1,
        position: [800, 0],
        credentials: { whatsAbleApi: { id: 'HeDeQJy4AxIJGYTL', name: 'Dorra Whatsable - Send' } },
    })
    SendWhatsapp = {
        productOperation: 'sendNonTemplateMessage',
        nonTemplateRecipient: '={{ $json.phone_e164 }}',
        messageContent: "={{ $('Verify HMAC').item.json.body.message }}",
    };

    @node({
        id: 'mrs-0009-4000-8000-000000000009',
        name: 'Persist Outbound (human)',
        type: 'n8n-nodes-base.postgres',
        version: 2.6,
        position: [960, 0],
        credentials: { postgres: { id: '<NEON_CRED_ID>', name: 'Neon — Dorra' } },
    })
    PersistOutboundHuman = {
        operation: 'executeQuery',
        query: `INSERT INTO messages
  (lead_id, direction, sender, actor_user_id, body, whatsable_message_id, created_at)
VALUES
  ($1::uuid, 'outbound', 'human', $2, $3, $4, NOW())
ON CONFLICT (whatsable_message_id) DO NOTHING
RETURNING id, created_at;`,
        options: {
            queryReplacement:
                "={{ $('Verify HMAC').item.json.body.lead_id }},={{ $('Verify HMAC').item.json.body.user_id }},={{ $('Verify HMAC').item.json.body.message }},={{ $('Verify HMAC').item.json.body.idempotency_key }}",
        },
    };

    @node({
        id: 'mrs-000a-4000-8000-00000000000a',
        name: 'Respond OK',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.1,
        position: [1120, 0],
    })
    RespondOk = {
        respondWith: 'json',
        responseBody: '={{ { message_id: $json.id, sent_at: $json.created_at } }}',
        options: {
            responseCode: 200,
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.VerifyHmac.in(0));
        this.VerifyHmac.out(0).to(this.IfSignatureOk.in(0));
        this.IfSignatureOk.out(0).to(this.FetchLead.in(0));
        this.IfSignatureOk.out(1).to(this.RespondUnauthorized.in(0));
        this.FetchLead.out(0).to(this.IfLeadPaused.in(0));
        this.IfLeadPaused.out(0).to(this.SendWhatsapp.in(0));
        this.IfLeadPaused.out(1).to(this.RespondConflict.in(0));
        this.SendWhatsapp.out(0).to(this.PersistOutboundHuman.in(0));
        this.PersistOutboundHuman.out(0).to(this.RespondOk.in(0));
    }
}
