import { Kafka, logLevel } from 'kafkajs';
import 'dotenv/config';

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  logLevel: logLevel.INFO,
  retry: {
    initialRetryTime: 300,
    retries: 8,
  },
});

export default kafka;
