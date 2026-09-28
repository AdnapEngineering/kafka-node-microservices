#!/usr/bin/env bash
# End-to-end check against the running Compose stack: POST an order to the
# order service, then wait for the notification worker to log that it
# consumed that order from Kafka.
set -euo pipefail

ORDER_URL="${ORDER_URL:-http://localhost:3000}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-30}"

response=$(curl -fsS -X POST "$ORDER_URL/orders" \
  -H 'Content-Type: application/json' \
  -d '{"customerId":"smoke-test","items":[{"sku":"ABC-1","qty":1}],"total":9.99}')
echo "Order service responded: $response"

order_id=$(echo "$response" | sed -n 's/.*"orderId":"\([^"]*\)".*/\1/p')
if [ -z "$order_id" ]; then
  echo "No orderId in response" >&2
  exit 1
fi

for _ in $(seq 1 "$TIMEOUT_SECONDS"); do
  if docker compose logs notification-service | grep -q "order: $order_id"; then
    echo "Notification service consumed $order_id"
    exit 0
  fi
  sleep 1
done

echo "Notification service did not consume $order_id within ${TIMEOUT_SECONDS}s" >&2
docker compose logs notification-service >&2
exit 1
