const { createClient } = require('@redis/client');

const client = createClient({
    url: 'redis://default:30KeaVYDfpKV8ZiLPYFQYJa4Omhttbtl@redis-18156.c341.af-south-1-1.ec2.redns.redis-cloud.com:18156',
    socket: { connectTimeout: 20000 },
});

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('Connected to Redis'));
client.on('ready', () => console.log('Redis client ready'));

client.connect()
    .then(() => console.log('Connection successful'))
    .catch((err) => console.error('Connection failed:', err));