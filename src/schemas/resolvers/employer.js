const { AuthenticationError, UserInputError } = require('apollo-server-express');
   const mongoose = require('mongoose');
   const Job = require('../../models/Job');
   const validate = require('../../middleware/validate');
   const redisClient = require('../../config/redis');
   const logger = require('../../config/logger');

   const employerResolvers = {
       Mutation: {
           createJob: async (_, { input }, { user }) => {
               if (!user || user.role !== 'employer') {
                   throw new AuthenticationError('Only employers can create jobs');
               }

               const { title, description, company, location, salary } = input;

               // Validate input
               await validate([
                   { value: title, type: 'string', min: 3 },
                   { value: description, type: 'string', min: 10 },
                   { value: company, type: 'string', min: 2 },
                   { value: location, type: 'string', min: 2 },
                   { value: salary, type: 'number', min: 0, optional: true },
               ]);

               const job = new Job({ ...input, postedBy: user.id });
               await job.save();

               // Add to recent jobs list
               await redisClient.lPush('recentJobs', job._id.toString());
               await redisClient.lTrim('recentJobs', 0, 9);

               // Invalidate caches
               await redisClient.del('jobs:search:*');
               logger.info(`Job ${job._id} created, caches invalidated`);

               return job;
           },
           updateJob: async (_, { id, input }, { user }) => {
               if (!user || user.role !== 'employer') {
                   throw new AuthenticationError('Only employers can update jobs');
               }

               // Validate ObjectId
               if (!mongoose.Types.ObjectId.isValid(id)) {
                   throw new UserInputError('Invalid job ID');
               }

               // Validate input
               await validate([
                   { value: input.title, type: 'string', min: 3, optional: true },
                   { value: input.description, type: 'string', min: 10, optional: true },
                   { value: input.company, type: 'string', min: 2, optional: true },
                   { value: input.location, type: 'string', min: 2, optional: true },
                   { value: input.salary, type: 'number', min: 0, optional: true },
               ]);

               const job = await Job.findById(id);
               if (!job) {
                   throw new UserInputError('Job not found');
               }
               if (job.postedBy.toString() !== user.id) {
                   throw new AuthenticationError('Not authorized to update this job');
               }

               Object.assign(job, input);
               await job.save();

               // Invalidate caches
               await redisClient.del('jobs:search:*');
               await redisClient.del(`job:${id}`);
               logger.info(`Job ${id} updated, caches invalidated`);

               return job;
           },
           deleteJob: async (_, { id }, { user }) => {
               if (!user || user.role !== 'employer') {
                   throw new AuthenticationError('Only employers can delete jobs');
               }

               // Validate ObjectId
               if (!mongoose.Types.ObjectId.isValid(id)) {
                   throw new UserInputError('Invalid job ID');
               }

               const job = await Job.findById(id);
               if (!job) {
                   throw new UserInputError('Job not found');
               }
               if (job.postedBy.toString() !== user.id) {
                   throw new AuthenticationError('Not authorized to delete this job');
               }

               await Job.findByIdAndDelete(id);

               // Invalidate caches
               await redisClient.del('jobs:search:*');
               await redisClient.del(`job:${id}`);
               logger.info(`Job ${id} deleted, caches invalidated`);

               return 'Job deleted successfully';
           },
       },
   };

   module.exports = employerResolvers;