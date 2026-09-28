import kafka from './kafka.js';

const admin = kafka.admin();

async function init() {
  try {
    console.log('Connecting admin client...');
    await admin.connect();

    console.log('Creating topics ...');
    await admin.createTopics({
      waitForLeaders: true,
      topics: [
        {
          topic: 'order-created',
          numPartitions: 2,
          replicationFactor: 1,
        },
      ],
    });
    console.log('Topic created successfully');
  } catch (error) {
    console.error('Error creating topic: ', error);
    process.exitCode = 1; // lets docker compose hold the services back
  } finally {
    await admin.disconnect();
  } //close the network socket to the broker
}

init();
