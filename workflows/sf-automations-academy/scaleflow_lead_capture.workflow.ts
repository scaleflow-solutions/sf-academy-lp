import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : ScaleFlow Academy - Lead Capture
// Nodes   : 6  |  Connections: 6
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// CheckoutWebhook                    webhook
// GenerateLeadId                     code
// HasScreenshot                      if
// UploadScreenshot                   googleDrive                [creds]
// AppendLeadRow                      googleSheets               [creds]
// RespondLeadId                      code
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// CheckoutWebhook
//    → GenerateLeadId
//      → HasScreenshot
//        → UploadScreenshot
//          → AppendLeadRow
//            → RespondLeadId
//       .out(1) → AppendLeadRow (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'jtxh1AOr02iKQYRz',
    name: 'ScaleFlow Academy - Lead Capture',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1' },
})
export class ScaleflowAcademyLeadCaptureWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e68aae84-5a64-4123-9b4f-87e1480bec1b',
        webhookId: '14ada432-e0a3-4061-873c-1414d11111ee',
        name: 'Checkout Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
    })
    CheckoutWebhook = {
        httpMethod: 'POST',
        path: 'scaleflow-checkout',
        responseMode: 'lastNode',
        responseData: 'firstEntryJson',
        responseBinaryPropertyName: 'data',
        options: {
            allowedOrigins: '*',
        },
    };

    @node({
        id: '75b6e6c0-c926-4962-8f5b-f87033d4c982',
        name: 'Generate Lead ID',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [220, 0],
    })
    GenerateLeadId = {
        mode: 'runOnceForEachItem',
        jsCode: `// Form text fields are nested under body for multipart/form-data.
const body = $json.body ?? $json;

// RFC4122 v4 UUID - Math.random is fine inside the n8n runtime.
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Idempotency: reuse a client-supplied lead_id if the page retries, else mint one.
const leadId = (body.lead_id && String(body.lead_id).trim()) || uuidv4();

// True only on the confirm POST that carries the screenshot binary.
const bin = $input.item.binary || {};
const hasScreenshot = Object.keys(bin).length > 0;

return {
  json: {
    lead_id: leadId,
    created_at: new Date().toISOString(),
    name: (body.name || '').toString().trim(),
    email: (body.email || '').toString().trim().toLowerCase(),
    phone: (body.phone || '').toString().replace(/\\s+/g, ''),
    amount: body.amount ?? '',
    currency: body.currency ?? 'EGP',
    payment_status: 'pending',
    access_status: 'not_granted',
    promo_code: '',
    activated_at: '',
    has_screenshot: hasScreenshot,
  },
  binary: $input.item.binary,
};`,
    };

    @node({
        id: 'f3938818-d85c-4621-9375-c0cd9b2f76e7',
        name: 'Has Screenshot?',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [440, 0],
    })
    HasScreenshot = {
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
                    id: 'has-bin',
                    leftValue: '={{ $json.has_screenshot }}',
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
        id: '71a5ba30-f396-433f-abec-f185ecd1b6cb',
        name: 'Upload Screenshot',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [660, -120],
        credentials: { googleDriveOAuth2Api: { id: 'REPLACE_GDRIVE_CRED', name: 'Google Drive account' } },
    })
    UploadScreenshot = {
        resource: 'file',
        operation: 'upload',
        name: '={{ $json.lead_id }}_payment_proof',
        inputDataFieldName: 'screenshot',
        driveId: {
            mode: 'list',
            value: 'My Drive',
            cachedResultName: 'My Drive',
        },
        folderId: {
            mode: 'id',
            value: '1tXL4znVn12LWEFJC0mruB1ts390_0Vnl',
        },
        options: {},
    };

    @node({
        id: 'e26a81ab-4d92-4c7a-adba-00c9b7b384c3',
        name: 'Append Lead Row',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [900, 0],
        credentials: { googleSheetsOAuth2Api: { id: 'a0C3GxXDu54sWf8t', name: 'ScaleFlow-GSheets' } },
    })
    AppendLeadRow = {
        resource: 'sheet',
        operation: 'appendOrUpdate',
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
            matchingColumns: ['lead_id'],
            value: {
                lead_id: "={{ $('Generate Lead ID').item.json.lead_id }}",
                created_at: "={{ $('Generate Lead ID').item.json.created_at }}",
                name: "={{ $('Generate Lead ID').item.json.name }}",
                email: "={{ $('Generate Lead ID').item.json.email }}",
                phone: "={{ $('Generate Lead ID').item.json.phone }}",
                amount: "={{ $('Generate Lead ID').item.json.amount }}",
                currency: "={{ $('Generate Lead ID').item.json.currency }}",
                screenshot_url: '={{ $json.webViewLink || "" }}',
                payment_status: "={{ $('Generate Lead ID').item.json.payment_status }}",
                access_status: "={{ $('Generate Lead ID').item.json.access_status }}",
                promo_code: '',
                activated_at: '',
            },
        },
        options: {},
    };

    @node({
        id: '20ae4f1b-664b-4102-b6c8-0ef139d5fe7d',
        name: 'Respond Lead ID',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1140, 0],
    })
    RespondLeadId = {
        mode: 'runOnceForEachItem',
        jsCode: `return {
  json: {
    ok: true,
    lead_id: $('Generate Lead ID').item.json.lead_id,
  },
};`,
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.CheckoutWebhook.out(0).to(this.GenerateLeadId.in(0));
        this.GenerateLeadId.out(0).to(this.HasScreenshot.in(0));
        this.HasScreenshot.out(0).to(this.UploadScreenshot.in(0));
        this.HasScreenshot.out(1).to(this.AppendLeadRow.in(0));
        this.UploadScreenshot.out(0).to(this.AppendLeadRow.in(0));
        this.AppendLeadRow.out(0).to(this.RespondLeadId.in(0));
    }
}
