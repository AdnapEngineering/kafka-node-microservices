# Kafka Node Microservices

[![CI](https://github.com/AdnapEngineering/kafka-node-microservices/actions/workflows/ci.yml/badge.svg)](https://github.com/AdnapEngineering/kafka-node-microservices/actions/workflows/ci.yml)

This project demonstrates an event-driven microservices architecture using Node.js, Express, TypeScript, and Kafka (`kafkajs`).

## Architecture

*   **Order Service**: An Express REST API that accepts new orders and publishes `order-created` events to Kafka.
*   **Notification Service**: A worker process that uses a Kafka consumer (`notification-service-group`) to subscribe to the `order-created` topic, reading messages from the beginning to log and process new orders.
*   **Shared**: Common configuration for the Kafka client and an admin script for topic initialization.

## Quick start (Docker)

Runs Kafka (single-node KRaft), creates the topics, and starts both services:

```bash
docker compose up --build
```

Then place an order:

```bash
curl -X POST http://localhost:3000/orders \
  -H 'Content-Type: application/json' \
  -d '{"customerId":"c-1","items":[{"sku":"ABC-1","qty":1}],"total":9.99}'
```

The `notification-service` logs show the order being consumed. `./scripts/smoke-test.sh` does the same check automatically against a running stack.

To run the services on your host instead, start only the broker with `docker compose up kafka` and follow the local setup below.

## Local setup

### Prerequisites

*   Node.js (v18+)
*   A running Kafka broker (`docker compose up kafka` works)

### Environment Variables

Create a `.env` file in the root directory (this file is ignored by Git):

```env
KAFKA_CLIENT_ID=my-app
KAFKA_BROKER=localhost:9092
ORDER_SERVICE_PORT=3000
```

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Initialize the Kafka topics:
   ```bash
   npm run init:topic
   ```

### Running the Services

Start the Order Service (API):
```bash
npm run dev:order
```

Start the Notification Service (Worker):
```bash
npm run dev:notification
```

## Development Commands

*   `npm run build`: Compiles TypeScript to JavaScript.
*   `npm run typecheck`: Type-checks without emitting.
*   `npm run format`: Formats code using Prettier.
*   `npm run format:check`: Verifies formatting (used in CI).

## CI

GitHub Actions runs on every push to `master` and every pull request:

1.   **Typecheck, format, build**
2.   **End-to-end smoke test**: brings up the full stack with Docker Compose, posts an order, and asserts the notification worker consumed it from Kafka.
