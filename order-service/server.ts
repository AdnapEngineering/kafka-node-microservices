import express, { Request, Response } from 'express';
import kafka from '../shared/kafka.js';
import 'dotenv/config';

const app = express();
app.use(express.json());

const PORT = process.env.ORDER_SERVICE_PORT;

const producer = kafka.producer();

app.post('/orders', async (req: Request, res: Response) => {
  const { customerId, items, total } = req.body;

  const order = {
    orderId: `ORD-${Date.now()}`,
    customerId,
    items,
    total,
    createdAt: new Date().toISOString(),
  };

  try {
    await producer.send({
      topic: 'order-created',
      messages: [
        {
          key: order.orderId,
          value: JSON.stringify(order),
        },
      ],
    });

    res.status(201).json({ status: 'success', data: order });
  } catch (error) {
    console.error('Failed to publish order:', error);
    res.status(500).json({ error: 'Failed to publish event' });
  }
});

async function start() {
  try {
    await producer.connect();
    console.log('Order Service producer connected.');
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize Order Service:', error);
    process.exit(1); // Fail-fast: crash immediately so Docker/K8s or process managers know startup failed
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await producer.disconnect();
  process.exit(0);
});

start();
