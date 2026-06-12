> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.whop.com/llms.txt>
> Use this file to discover all available pages before exploring further.

# Webhooks

> Receive payment, membership, and event notifications from Whop in realtime.

Webhooks are `POST` requests from Whop to your server. Use them to react to events like `payment.succeeded`, `membership.activated`, or `entry.created`.

<Tip>
  Webhooks follow the [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks) spec. Our SDKs handle unwrapping and signature verification for you.
</Tip>

## Set up a webhook

<Steps>
  <Step title="Create the webhook in the dashboard">
    Navigate to the [Developer tab in your dashboard](https://whop.com/dashboard/developer).

    Click **Create Webhook** in the top right corner.
  </Step>

  <Step title="Choose events and URL">
    Enter your webhook URL and select the events that you want to receive.
    Ensure that you are on API version `v1`.

    <Info>
      When testing locally, use ngrok or Cloudflare Tunnel to forward requests to your local development environment.
    </Info>
  </Step>

  <Step title="Store the webhook secret">
    Copy the webhook secret from the dashboard and store it as `WHOP_WEBHOOK_SECRET`.
  </Step>

  <Step title="Handle events on your server">
    Your endpoint now receives `POST` requests for every event you selected. See [Validating webhooks](#validating-webhooks) for example handlers.
  </Step>
</Steps>

## Validating webhooks

Always verify webhook signatures before you trust the payload. Otherwise someone could send your endpoint a fake event.

<Steps>
  <Step title="Set up your SDK client">
    Pass the secret into the SDK client on construction:

    <CodeGroup>
      ```typescript Typescript theme={null}
      import { Whop } from "@whop/sdk";

      export const whopsdk = new Whop({
          apiKey: process.env.WHOP_API_KEY,
          webhookKey: btoa(process.env.WHOP_WEBHOOK_SECRET || ""),
      });
      ```

      ```python Python theme={null}
      import base64
      import os
      from whop_sdk import Whop

      # webhook_key must be base64-encoded — the SDK passes it
      # straight to the Standard Webhooks verifier, which expects b64.
      whopsdk = Whop(
          api_key=os.environ["WHOP_API_KEY"],
          webhook_key=base64.b64encode(os.environ["WHOP_WEBHOOK_SECRET"].encode()).decode(),
      )
      ```

      ```ruby Ruby theme={null}
      require "base64"
      require "whop_sdk"

      # webhook_key must be base64-encoded — the SDK passes it
      # straight to the Standard Webhooks verifier, which expects b64.
      whopsdk = WhopSDK::Client.new(
        api_key: ENV["WHOP_API_KEY"],
        webhook_key: Base64.strict_encode64(ENV["WHOP_WEBHOOK_SECRET"]),
      )
      ```
    </CodeGroup>
  </Step>

  <Step title="Set up your API handler">
    Create a route that accepts HTTP `POST` requests. Use the same URL you entered during webhook creation.

    <Note>
      Our SDK unwraps and verifies the signature in one call. A bad signature raises; your handler won't see tampered events.
    </Note>

    <Tip>
      The TypeScript example uses `waitUntil` from `@vercel/functions` to run the handler after responding `200`. On other runtimes (Bun, Cloudflare Workers, Fastify, Hono) swap it for your framework's equivalent background-task primitive, or a job queue. The Python and Ruby examples show framework-native equivalents.
    </Tip>

    <CodeGroup>
      ```typescript Typescript + NextJS theme={null}
      import { waitUntil } from "@vercel/functions";
      import type { Payment } from "@whop/sdk/resources.js";
      import type { NextRequest } from "next/server";
      import { whopsdk } from "@/lib/whop-sdk";

      export async function POST(request: NextRequest): Promise<Response> {
          // Validate the webhook to ensure it's from Whop
          const requestBodyText = await request.text();
          const headers = Object.fromEntries(request.headers);
          const webhookData = whopsdk.webhooks.unwrap(requestBodyText, { headers });

          // Handle the webhook event
          if (webhookData.type === "payment.succeeded") {
          waitUntil(handlePaymentSucceeded(webhookData.data));
          }

          // Make sure to return a 2xx status code quickly. Otherwise the webhook will be retried.
          return new Response("OK", { status: 200 });
      }

      async function handlePaymentSucceeded(invoice: Payment) {
          // This is a placeholder for a potentially long running operation
          // In a real scenario, you might need to fetch user data, update a database, etc.
          console.log("[PAYMENT SUCCEEDED]", invoice);
      }
      ```

      ```python Python + FastAPI theme={null}
      from fastapi import BackgroundTasks, FastAPI, Request, Response
      from lib.whop_sdk import whopsdk

      app = FastAPI()

      @app.post("/api/webhooks/whop")
      async def whop_webhook(request: Request, background: BackgroundTasks):
          # Unwrap + verify signature in one call. Raises on invalid signatures.
          body = (await request.body()).decode()
          event = whopsdk.webhooks.unwrap(body, headers=dict(request.headers))

          if event.type == "payment.succeeded":
              background.add_task(handle_payment_succeeded, event.data)

          # Respond 2xx quickly or Whop will retry.
          return Response(status_code=200)


      def handle_payment_succeeded(payment):
          # Replace with your fulfillment logic.
          print(f"[PAYMENT SUCCEEDED] {payment.id}")
      ```

      ```ruby Ruby on Rails theme={null}
      class Api::WebhooksController < ApplicationController
        skip_before_action :verify_authenticity_token

        def whop
          # Unwrap + verify signature in one call. Raises on invalid signatures.
          event = whopsdk.webhooks.unwrap(
            request.raw_post,
            headers: request.headers.to_h,
          )

          if event.type == "payment.succeeded"
            HandlePaymentSucceededJob.perform_later(event.data.id)
          end

          # Respond 2xx quickly or Whop will retry.
          head :ok
        end
      end
      ```

      ```bash cURL (verify manually) theme={null}
      # Standard Webhooks signatures live in these headers:
      #   webhook-id        — unique event id
      #   webhook-timestamp — unix seconds
      #   webhook-signature — v1,<base64-hmac-sha256>
      #
      # To verify manually: signed_content = "{id}.{timestamp}.{body}"
      # then HMAC-SHA256 with your base64-decoded secret and
      # compare base64-encoded output to the signature.
      curl -X POST https://your-domain.com/webhooks/whop \
        -H "webhook-id: msg_..." \
        -H "webhook-timestamp: 1735689600" \
        -H "webhook-signature: v1,..." \
        -H "content-type: application/json" \
        -d '{"type":"payment.succeeded","data":{...}}'
      ```
    </CodeGroup>
  </Step>
</Steps>

## Delivery guarantees

* **At-least-once delivery.** You may receive the same event more than once. Make your handler idempotent. Use the `webhook-id` header (or a unique field in the event body) as a dedup key.
* **Retries on non-2xx responses.** Whop makes the initial delivery attempt, then retries up to 3 times after 10 seconds, 20 seconds, and 40 seconds if your endpoint errors or does not return a 2xx in time. Failed deliveries stop after that short retry window.
* **Ordering is not guaranteed.** An event created later may arrive before an earlier one. Don't assume sequential delivery.
* **Respond fast.** Do the minimum work needed to acknowledge the event (verify + enqueue), then return 2xx. Long-running fulfillment belongs in a background task.

<Card title="Troubleshoot webhook delivery" icon="bug" href="/developer/troubleshooting#webhook-delivery">
  Fix signature failures, retries, duplicate events, and local tunnel issues.
</Card>

## Available webhooks

Every webhook Whop sends is documented in the [API Reference](/api-reference/). Within each resource, the `hook` pages specify the event name and the exact payload schema.

Common events:

* [`payment.succeeded`](/api-reference/payments/payment-succeeded): a payment is successfully processed.
* [`membership.activated`](/api-reference/memberships/membership-activated): someone joins your community on a product.
* [`membership.deactivated`](/api-reference/memberships/membership-deactivated): a membership goes invalid (failed payment, cancellation, or leaving).
* [`entry.created`](/api-reference/entries/entry-created): someone joins a waitlist.
* [`refund.created`](/api-reference/refunds/refund-created): a payment is refunded.
* [`dispute.created`](/api-reference/disputes/dispute-created): a buyer opens a chargeback.

## Next steps

<CardGroup cols={2}>
  <Card title="Accept payments" href="/developer/guides/accept-payments">
    Pair `payment.succeeded` webhooks with checkout to fulfill orders.
  </Card>

  <Card title="Save payment methods" href="/developer/guides/save-payment-methods">
    Use setup intents + webhooks to charge customers later.
  </Card>

  <Card title="API walkthrough" href="/developer/api/getting-started">
    See where webhooks fit alongside checkout, transfers, and KYC.
  </Card>

  <Card title="Run a local dev proxy" href="/developer/guides/dev-proxy">
    Forward Whop webhooks to localhost while developing.
  </Card>
</CardGroup>
