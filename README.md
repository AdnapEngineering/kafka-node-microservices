# Kafka Node Microservices

This project demonstrates an event-driven microservices architecture using Node.js, Express, TypeScript, and Kafka (`kafkajs`).

## Architecture

*   **Order Service**: An Express REST API that accepts new orders and publishes `order-created` events to Kafka.
*   **Notification Service**: A worker process that uses a Kafka consumer (`notification-service-group`) to subscribe to the `order-created` topic, reading messages from the beginning to log and process new orders.
*   **Shared**: Common configuration for the Kafka client and an admin script for topic initialization.

## Prerequisites

*   Node.js (v18+)
*   A running Kafka broker (local or remote)

## Environment Variables

Create a `.env` file in the root directory (this file is ignored by Git):

```env
KAFKA_CLIENT_ID=my-app
KAFKA_BROKER=localhost:9092
ORDER_SERVICE_PORT=3000
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Initialize the Kafka topics:
   ```bash
   npm run init:topic
   ```

## Running the Services

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
*   `npm run format`: Formats code using Prettier.
