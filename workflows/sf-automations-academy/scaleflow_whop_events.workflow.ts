import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : ScaleFlow Academy - Whop Events
// Nodes   : 6  |  Connections: 5
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhopWebhook                        webhook
// VerifySignature                    code
// IfSignatureOk                      if
// NormalizeEvent                     code
// FilterActionable                   filter
// UpdateLeadByEmail                  googleSheets               [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhopWebhook
//    → VerifySignature
//      → IfSignatureOk
//        → NormalizeEvent
//          → FilterActionable
//            → UpdateLeadByEmail
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '18s82djzJGVPCijQ',
    name: 'ScaleFlow Academy - Whop Events',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1' },
})
export class ScaleflowAcademyWhopEventsWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '5d470363-072e-4108-b75a-9433049fd61e',
        webhookId: '25a8759d-a5a7-4833-81bd-d08f7c58459f',
        name: 'Whop Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
    })
    WhopWebhook = {
        httpMethod: 'POST',
        path: 'whop-events',
        responseMode: 'onReceived',
        responseCode: 200,
        responseData: 'noData',
        responseBinaryPropertyName: 'data',
        options: {
            rawBody: true,
        },
    };

    @node({
        id: '0d4edf5e-721b-4460-b59a-723d17566e59',
        name: 'Verify Signature',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [220, 0],
    })
    VerifySignature = {
        mode: 'runOnceForEachItem',
        jsCode: `const crypto = require('crypto');

const item = $input.item;
const headers = item.json.headers || {};
const rawBody = item.binary?.body?.data
  ? Buffer.from(item.binary.body.data, 'base64').toString('utf8')
  : JSON.stringify(item.json.body ?? {});

const id = headers['webhook-id'] || headers['Webhook-Id'] || '';
const ts = headers['webhook-timestamp'] || headers['Webhook-Timestamp'] || '';
const sigHeader = headers['webhook-signature'] || headers['Webhook-Signature'] || '';
const secret = $env.WHOP_WEBHOOK_SECRET || '';

if (!secret) {
  return { json: { ok: false, status: 500, error: 'WHOP_WEBHOOK_SECRET not set' } };
}

const signed = id + '.' + ts + '.' + rawBody;

// Whop's SDK passes btoa(secret) to the verifier (which base64-decodes it back
// to the raw secret), so the HMAC key is the raw secret bytes. We also try the
// classic Standard Webhooks form (base64 after a 'whsec_' prefix) defensively.
const keys = [Buffer.from(secret, 'utf8')];
try { keys.push(Buffer.from(secret.replace(/^whsec_/, ''), 'base64')); } catch (e) {}

const expecteds = keys.map((k) =>
  crypto.createHmac('sha256', k).update(signed).digest('base64'),
);

const provided = String(sigHeader)
  .split(' ')
  .map((s) => (s.includes(',') ? s.split(',')[1] : s))
  .filter(Boolean);

const safeEq = (a, b) => {
  try {
    return a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch (e) {
    return false;
  }
};

const ok = provided.some((s) => expecteds.some((e) => safeEq(s, e)));

return { json: { ok, body: item.json.body ?? {} } };`,
    };

    @node({
        id: 'cbc73961-358c-44ab-91e2-b40eb48420a9',
        name: 'If Signature OK',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [440, 0],
    })
    IfSignatureOk = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 2,
            },
            combinator: 'and',
            conditions: [
                {
                    id: 'sig-ok',
                    leftValue: '={{ $json.ok }}',
                    rightValue: true,
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
        },
    };

    @node({
        id: '4773e435-6caa-4d2d-9b0f-c76d8feb4d40',
        name: 'Normalize Event',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [660, 0],
    })
    NormalizeEvent = {
        mode: 'runOnceForEachItem',
        jsCode: `const b = $json.body || {};
const type = b.type || b.action || '';
const d = b.data || {};

const email = String(
  d.email || (d.user && d.user.email) || (d.member && d.member.email) || d.user_email || '',
).toLowerCase().trim();

const membershipId = d.id || d.membership_id || (d.membership && d.membership.id) || '';

const STATUS = {
  'membership.activated': 'joined',
  'membership.deactivated': 'deactivated',
  'refund.created': 'refunded',
  'dispute.created': 'disputed',
  'payment.succeeded': 'paid_on_whop',
};
const whop_status = STATUS[type] || '';
const actionable = !!whop_status && !!email;

return {
  json: { type, email, membershipId, whop_status, actionable, event_at: new Date().toISOString() },
};`,
    };

    @node({
        id: '4d8364e5-00de-4230-ae9c-0d9613bade61',
        name: 'Filter Actionable',
        type: 'n8n-nodes-base.filter',
        version: 2.3,
        position: [880, 0],
    })
    FilterActionable = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 2,
            },
            combinator: 'and',
            conditions: [
                {
                    id: 'is-actionable',
                    leftValue: '={{ $json.actionable }}',
                    rightValue: true,
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
        },
    };

    @node({
        id: '8418b3fc-5367-460d-9f72-e6bc7b62ceb1',
        name: 'Update Lead By Email',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [1100, 0],
        credentials: { googleSheetsOAuth2Api: { id: 'a0C3GxXDu54sWf8t', name: 'ScaleFlow-GSheets' } },
    })
    UpdateLeadByEmail = {
        resource: 'sheet',
        operation: 'update',
        documentId: {
            mode: 'list',
            value: '18wpzvyLnxncIFCb18Qp3-3gavazWd4BPBwg2sA3jUmw',
            cachedResultName: 'ScaleFlow Academy - Leads DB',
        },
        sheetName: {
            mode: 'list',
            value: '1737727568',
            cachedResultName: 'leads',
        },
        columns: {
            mappingMode: 'defineBelow',
            matchingColumns: ['email'],
            value: {
                email: '={{ $json.email }}',
                whop_status: '={{ $json.whop_status }}',
                whop_membership_id: '={{ $json.membershipId }}',
                whop_event_at: '={{ $json.event_at }}',
            },
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WhopWebhook.out(0).to(this.VerifySignature.in(0));
        this.VerifySignature.out(0).to(this.IfSignatureOk.in(0));
        this.IfSignatureOk.out(0).to(this.NormalizeEvent.in(0));
        this.NormalizeEvent.out(0).to(this.FilterActionable.in(0));
        this.FilterActionable.out(0).to(this.UpdateLeadByEmail.in(0));
    }
}
