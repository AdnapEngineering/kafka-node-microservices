import 'dotenv/config';
import kafka from '../shared/kafka.js';

const consumer = kafka.consumer({ groupId: 'notification-service-group' });

async function start() {
  try {
    await consumer.connect();
    console.log('Notification Service consumer connected.');

    await consumer.subscribe({
      topic: 'order-created',
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const key = message.key?.toString();
        const rawValue = message.value?.toString();

        if (!rawValue) return;

        const order = JSON.parse(rawValue);

        console.log(
          `[Notification Service] Processing notification for order: ${order.orderId}`
        );
        console.log(
          `Partition: ${partition} | Key: ${key} | Customer: ${order.customerId} | Total: $${order.total}`
        );

        // Business logic goes here
      },
    });
  } catch (error) {
    console.error('Failed to run Notification Service:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Disconnecting consumer...');
  await consumer.disconnect();
  process.exit(0);
});

start();
