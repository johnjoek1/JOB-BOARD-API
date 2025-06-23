
const { Job, Application } = require('../../models');
const redisClient = require('../../config/redis');
const crypto = require('crypto');

const jobSeekerResolvers = {
    Query: {
        jobs: async (_, { filter = {}, page = 1, limit = 10 }, { user, models }) => {
            if (!user || user.role !== 'job_seeker') {
                throw new Error('Unauthorized');
            }

            const cacheKey = `v1:jobs:search:${crypto
                .createHash('sha256')
                .update(JSON.stringify(filter) + page + limit)
                .digest('hex')}`;
            
            try {
                const cachedJobs = await redisClient.get(cacheKey);
                if (cachedJobs) {
                    console.log(`Cache hit for ${cacheKey}`);
                    return JSON.parse(cachedJobs);
                }
            } catch (err) {
                console.error('Redis cache error:', err);
            }

            const query = {};
            if (filter.location) query.location = filter.location;
            if (filter.keyword) query.title = { $regex: filter.keyword, $options: 'i' };
            if (filter.minSalary) query.salary = { $gte: filter.minSalary };
            if (filter.company) query.company = { $regex: filter.company, $options: 'i' };

            const jobs = await models.Job.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('postedBy', 'username');

            try {
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(jobs));
                console.log(`Cache miss for ${cacheKey}, stored in Redis with 1-hour TTL`);
            } catch (err) {
                console.error('Redis cache store error:', err);
            }

            if (filter.keyword) {
                const searchKey = `v1:search:${user.id}`;
                try {
                    await redisClient.rPush(searchKey, filter.keyword);
                    await redisClient.expire(searchKey, 3600);
                    console.log(`Stored search history for user ${user.id}`);
                } catch (err) {
                    console.error('Redis search history error:', err);
                }
            }

            return jobs;
        },

        recentSearches: async (_, __, { user }) => {
            if (!user || user.role !== 'job_seeker') {
                throw new Error('Unauthorized');
            }

            const searchKey = `v1:search:${user.id}`;
            try {
                const searches = await redisClient.lRange(searchKey, 0, -1);
                return searches;
            } catch (err) {
                console.error('Redis recent searches error:', err);
                return [];
            }
        },
    },

    Mutation: {
        applyForJob: async (_, { input }, { user, models }) => {
            if (!user || user.role !== 'job_seeker') {
                throw new Error('Unauthorized');
            }

            const { jobId, education, experience, personalInfo } = input;
            const job = await models.Job.findById(jobId);
            if (!job) {
                throw new Error('Job not found');
            }

            const application = new models.Application({
                job: jobId,
                user: user.id, // Updated to match Application.js
                education,
                experience,
                personalInfo,
                status: 'pending' // Match Application.js enum
            });

            await application.save();

            const cacheKey = `v1:job:${jobId}`;
            try {
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(job));
                console.log(`Cache miss for ${cacheKey}, stored in Redis with 1-hour TTL`);
            } catch (err) {
                console.error('Redis cache store error:', err);
            }

            return application;
        },
    },
};

module.exports = jobSeekerResolvers;







































/**
const { Job, Application } = require('../../models');
const redisClient = require('../../config/redis');
const crypto = require('crypto');

const jobSeekerResolvers = {
    Query: {
        jobs: async (_, { filter = {}, page = 1, limit = 10 }, { user }) => {
            if (!user || user.role !== 'job_seeker') {
                throw new Error('Unauthorized');
            }

            const cacheKey = `v1:jobs:search:${crypto
                .createHash('sha256')
                .update(JSON.stringify(filter) + page + limit)
                .digest('hex')}`;
            
            try {
                const cachedJobs = await redisClient.get(cacheKey);
                if (cachedJobs) {
                    console.log(`Cache hit for ${cacheKey}`);
                    return JSON.parse(cachedJobs);
                }
            } catch (err) {
                console.error('Redis cache error:', err);
            }

            const query = {};
            if (filter.location) query.location = filter.location;
            if (filter.keyword) query.title = { $regex: filter.keyword, $options: 'i' };
            if (filter.minSalary) query.salary = { $gte: filter.minSalary };

            const jobs = await Job.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('postedBy', 'username');

            try {
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(jobs));
                console.log(`Cache miss for ${cacheKey}, stored in Redis with 1-hour TTL`);
            } catch (err) {
                console.error('Redis cache store error:', err);
            }

            if (filter.keyword) {
                const searchKey = `v1:search:${user.id}`;
                try {
                    await redisClient.rPush(searchKey, filter.keyword);
                    await redisClient.expire(searchKey, 3600);
                    console.log(`Stored search history for user ${user.id}`);
                } catch (err) {
                    console.error('Redis search history error:', err);
                }
            }

            return jobs;
        },

        recentSearches: async (_, __, { user }) => {
            if (!user || user.role !== 'job_seeker') {
                throw new Error('Unauthorized');
            }

            const searchKey = `v1:search:${user.id}`;
            try {
                const searches = await redisClient.lRange(searchKey, 0, -1);
                return searches;
            } catch (err) {
                console.error('Redis recent searches error:', err);
                return [];
            }
        },
    },

    Mutation: {
        applyForJob: async (_, { input }, { user }) => {
            if (!user || user.role !== 'job_seeker') {
                throw new Error('Unauthorized');
            }

            const { jobId, education, experience, personalInfo } = input;
            const job = await Job.findById(jobId);
            if (!job) {
                throw new Error('Job not found');
            }

            const application = new Application({
                job: jobId,
                jobSeeker: user.id,
                education,
                experience,
                personalInfo,
                status: 'PENDING',
            });

            await application.save();

            const cacheKey = `v1:job:${jobId}`;
            try {
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(job));
                console.log(`Cache miss for ${cacheKey}, stored in Redis with 1-hour TTL`);
            } catch (err) {
                console.error('Redis cache store error:', err);
            }

            return application;
        },
    },
};

module.exports = jobSeekerResolvers;
*?