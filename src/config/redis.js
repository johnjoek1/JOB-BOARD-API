
const { createClient } = require('@redis/client');

console.log('Redis URL from env:', process.env.REDIS_URL);

if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined in environment variables');
}

const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
        connectTimeout: 20000,
        reconnectStrategy: (retries) => {
            if (retries > 3) return false; // Max 3 retries
            return Math.min(retries * 1000, 3000); // Wait 1-3s
        },
    },
});

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('Connected to Redis'));
client.on('ready', () => console.log('Redis client ready'));
client.on('end', () => console.log('Redis connection closed'));

client.connect()
    .then(() => console.log('Connection successful'))
    .catch((err) => console.error('Connection failed:', err));

module.exports = client;

