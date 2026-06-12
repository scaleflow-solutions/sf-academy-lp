import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : ScaleFlow Academy - Access Grant
// Nodes   : 8  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// EveryMinute                        scheduleTrigger
// ReadLeads                          googleSheets               [creds]
// GateOnGranted                      filter
// BuildPromoCode                     code
// WhopCreatePromo                    httpRequest                [creds]
// BuildCheckoutLink                  code
// DeliverAccessLink                  whatsAble                  [creds]
// MarkActivated                      googleSheets               [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// EveryMinute
//    → ReadLeads
//      → GateOnGranted
//        → BuildPromoCode
//          → WhopCreatePromo
//            → BuildCheckoutLink
//              → DeliverAccessLink
//                → MarkActivated
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '2Z2GNWkoiTrsLOwO',
    name: 'ScaleFlow Academy - Access Grant',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1' },
})
export class ScaleflowAcademyAccessGrantWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '9a319b22-9a00-4bc0-aff6-e046ca8251a1',
        name: 'Every Minute',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.3,
        position: [0, 0],
    })
    EveryMinute = {
        rule: {
            interval: [
                {
                    field: 'minutes',
                    minutesInterval: 1,
                },
            ],
        },
    };

    @node({
        id: '54affc8a-2729-4193-adad-c35f85906a8a',
        name: 'Read Leads',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [220, 0],
        credentials: { googleSheetsOAuth2Api: { id: 'a0C3GxXDu54sWf8t', name: 'ScaleFlow-GSheets' } },
    })
    ReadLeads = {
        resource: 'sheet',
        operation: 'read',
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
        options: {},
    };

    @node({
        id: '729a3d8f-7b07-458a-9ff5-25ed73070357',
        name: 'Gate On Granted',
        type: 'n8n-nodes-base.filter',
        version: 2.3,
        position: [440, 0],
    })
    GateOnGranted = {
        conditions: {
            options: {
                caseSensitive: false,
                leftValue: '',
                typeValidation: 'loose',
                version: 2,
            },
            combinator: 'and',
            conditions: [
                {
                    id: 'cond-granted',
                    leftValue: '={{ $json.access_status }}',
                    rightValue: 'granted',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                    },
                },
                {
                    id: 'cond-not-activated',
                    leftValue: '={{ $json.promo_code }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'empty',
                        singleValue: true,
                    },
                },
            ],
        },
    };

    @node({
        id: '00a626ef-7480-451a-a2eb-9bab700cbf5d',
        name: 'Build Promo Code',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [660, 0],
    })
    BuildPromoCode = {
        mode: 'runOnceForEachItem',
        jsCode: `const lead = $json;
const shortId = String(lead.lead_id || '').replace(/-/g, '').slice(0, 8).toUpperCase();
const code = 'SF' + shortId; // e.g. SF1A2B3C4D
return { json: { ...lead, promo_code_to_create: code } };`,
    };

    @node({
        id: 'a836ce7e-dea8-41c5-ba0a-ca3e82bcd981',
        name: 'Whop Create Promo',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [880, 0],
        credentials: { httpHeaderAuth: { id: 'REPLACE_WHOP_HEADER_AUTH', name: 'Whop API' } },
    })
    WhopCreatePromo = {
        method: 'POST',
        url: 'https://api.whop.com/api/v1/promo_codes',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "code": "{{ $json.promo_code_to_create }}",
  "company_id": "{{ $env.WHOP_COMPANY_ID }}",
  "promo_type": "percentage",
  "amount_off": 100,
  "base_currency": "usd",
  "new_users_only": false,
  "promo_duration_months": 12,
  "stock": 1,
  "unlimited_stock": false,
  "one_per_customer": true,
  "plan_ids": ["{{ $env.WHOP_PLAN_ID }}"]
}`,
        options: {},
    };

    @node({
        id: '42e374da-5484-41fa-845e-18a8eb418cec',
        name: 'Build Checkout Link',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1100, 0],
    })
    BuildCheckoutLink = {
        mode: 'runOnceForEachItem',
        jsCode: `const lead = $('Build Promo Code').item.json;
const code = lead.promo_code_to_create;

// Set WHOP_CHECKOUT_BASE to your product/plan checkout URL, e.g.
// https://whop.com/checkout/plan_xxxxxxxx
const base = $env.WHOP_CHECKOUT_BASE || 'https://whop.com/checkout';
const checkout_link = base + '?promo=' + encodeURIComponent(code);

// Egyptian local (01XXXXXXXXX) -> E.164 without '+' (20XXXXXXXXXX) for WhatsApp.
let p = String(lead.phone || '').replace(/\\D/g, '');
if (p.startsWith('0')) p = '20' + p.slice(1);
else if (!p.startsWith('20')) p = '20' + p;

return { json: { ...lead, promo_code: code, checkout_link, phone_e164: p } };`,
    };

    @node({
        id: '2c485780-9073-4686-9ddc-f2db276ae841',
        name: 'Deliver Access Link',
        type: 'n8n-nodes-whatsable.whatsAble',
        version: 1,
        position: [1320, 0],
        credentials: { whatsAbleApi: { id: 'HeDeQJy4AxIJGYTL', name: 'Dorra Whatsable - Send' } },
    })
    DeliverAccessLink = {
        productOperation: 'sendNonTemplateMessage',
        nonTemplateRecipient: '={{ $json.phone_e164 }}',
        messageContent: `=أهلاً {{ $json.name }} 👋
تم تأكيد دفعتك وتفعيل اشتراكك في أكاديمية سكيل فلو 🎉

ادخل الكوميونيتي والكورس من هنا:
{{ $json.checkout_link }}

كود التفعيل الخاص بيك: {{ $json.promo_code }}

مرحباً بيك في النخبة 🚀`,
    };

    @node({
        id: '742732d5-0c3d-40f4-9e57-4d90be44b1ec',
        name: 'Mark Activated',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [1540, 0],
        credentials: { googleSheetsOAuth2Api: { id: 'a0C3GxXDu54sWf8t', name: 'ScaleFlow-GSheets' } },
    })
    MarkActivated = {
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
            matchingColumns: ['lead_id'],
            value: {
                lead_id: "={{ $('Build Checkout Link').item.json.lead_id }}",
                promo_code: "={{ $('Build Checkout Link').item.json.promo_code }}",
                access_status: 'access_activated',
                activated_at: '={{ $now.toISO() }}',
                checkout_link: "={{ $('Build Checkout Link').item.json.checkout_link }}",
            },
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.EveryMinute.out(0).to(this.ReadLeads.in(0));
        this.ReadLeads.out(0).to(this.GateOnGranted.in(0));
        this.GateOnGranted.out(0).to(this.BuildPromoCode.in(0));
        this.BuildPromoCode.out(0).to(this.WhopCreatePromo.in(0));
        this.WhopCreatePromo.out(0).to(this.BuildCheckoutLink.in(0));
        this.BuildCheckoutLink.out(0).to(this.DeliverAccessLink.in(0));
        this.DeliverAccessLink.out(0).to(this.MarkActivated.in(0));
    }
}
