
require('dotenv').config(); // Load .env immediately
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const models = require('./src/models'); // Import models
const typeDefs = require('./src/schemas/typeDefs');
const authResolvers = require('./src/schemas/resolvers/auth');
const employerResolvers = require('./src/schemas/resolvers/employer');
const jobSeekerResolvers = require('./src/schemas/resolvers/jobSeeker');
const authenticate = require('./src/middleware/auth');
const logger = require('./src/config/logger');
const fs = require('fs');

// Debug .env
try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    console.log('Raw .env content:', envContent);
    console.log('Parsed .env:', require('dotenv').parse(envContent));
} catch (err) {
    console.error('Error reading .env:', err);
}

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('REDIS_URL:', process.env.REDIS_URL);

// Suppress Mongoose warning
mongoose.set('strictQuery', true);

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers: [authResolvers, employerResolvers, jobSeekerResolvers],
    context: ({ req }) => {
        let user = null;
        try {
            user = authenticate({ req });
        } catch (err) {
            logger.error('Authentication error:', err);
        }
        return { req, user, models }; // Add models to context
    },
});

async function startServer() {
    try {
        await server.start();
        server.applyMiddleware({ app });

        console.log('Attempting MongoDB connection...');
        await mongoose.connect(process.env.MONGODB_URI, { connectTimeoutMS: 20000 });
        logger.info('Connected to MongoDB');

        // Initialize Redis after .env is loaded
        const redisClient = require('./src/config/redis');

        const PORT = process.env.PORT || 3050;
        app.listen(PORT, () => logger.info(`Server running on http://localhost:${PORT}${server.graphqlPath}`));
    } catch (err) {
        logger.error('Server startup error:', err);
        process.exit(1);
    }
}

startServer();












































/** 
require('dotenv').config(); // Load .env immediately
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./src/schemas/typeDefs');
const authResolvers = require('./src/schemas/resolvers/auth');
const employerResolvers = require('./src/schemas/resolvers/employer');
const jobSeekerResolvers = require('./src/schemas/resolvers/jobSeeker');
const authenticate = require('./src/middleware/auth');
const logger = require('./src/config/logger');
const fs = require('fs');

// Debug .env
try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    console.log('Raw .env content:', envContent);
    console.log('Parsed .env:', require('dotenv').parse(envContent));
} catch (err) {
    console.error('Error reading .env:', err);
}

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('REDIS_URL:', process.env.REDIS_URL);

// Suppress Mongoose warning
mongoose.set('strictQuery', true);

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers: [authResolvers, employerResolvers, jobSeekerResolvers],
    context: ({ req }) => {
        let user = null;
        try {
            user = authenticate({ req });
        } catch (err) {
            logger.error('Authentication error:', err);
        }
        return { req, user };
    },
});

async function startServer() {
    try {
        await server.start();
        server.applyMiddleware({ app });

        console.log('Attempting MongoDB connection...');
        await mongoose.connect(process.env.MONGODB_URI, { connectTimeoutMS: 20000 });
        logger.info('Connected to MongoDB');

        // Initialize Redis after .env is loaded
        const redisClient = require('./src/config/redis');

        const PORT = process.env.PORT || 3050;
        app.listen(PORT, () => logger.info(`Server running on http://localhost:${PORT}${server.graphqlPath}`));
    } catch (err) {
        logger.error('Server startup error:', err);
        process.exit(1);
    }
}

startServer();

*/











































