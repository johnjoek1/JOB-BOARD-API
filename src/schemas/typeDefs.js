
const { gql } = require('apollo-server-express');

   const typeDefs = gql`
       type User {
           id: ID!
           username: String!
           email: String!
           role: String!
           createdAt: String
       }

       type Job {
           id: ID!
           title: String!
           description: String!
           company: String!
           location: String!
           salary: Float
           jobType: String
           postedBy: User!
           createdAt: String
       }

       type Application {
           id: ID!
           job: Job!
           user: User!
           education: [Education]
           experience: [Experience]
           personalInfo: PersonalInfo
           status: String
           appliedAt: String
       }

       type Education {
           institution: String!
           degree: String!
           year: Int!
       }

       type Experience {
           company: String!
           role: String!
           years: Int!
       }

       type PersonalInfo {
           fullName: String!
           phone: String!
           address: String!
       }

       input RegisterInput {
           username: String!
           email: String!
           password: String!
           role: String!
       }

       input JobInput {
           title: String!
           description: String!
           company: String!
           location: String!
           salary: Float
           jobType: String
       }

       input UpdateJobInput {
           title: String
           description: String
           company: String
           location: String
           salary: Float
           jobType: String
       }

       input JobFilter {
           keyword: String
           location: String
           company: String
           minSalary: Float
       }

       input EducationInput {
           institution: String!
           degree: String!
           year: Int!
       }

       input ExperienceInput {
           company: String!
           role: String!
           years: Int!
       }

       input PersonalInfoInput {
           fullName: String!
           phone: String!
           address: String!
       }

       input ApplyForJobInput {
           jobId: ID!
           education: [EducationInput]
           experience: [ExperienceInput]
           personalInfo: PersonalInfoInput
       }

       type AuthPayload {
           token: String!
           user: User!
       }

       type Query {
           jobs(filter: JobFilter, page: Int, limit: Int): [Job]
           recentSearches: [String]
       }

       type Mutation {
           register(input: RegisterInput): AuthPayload
           login(email: String!, password: String!): AuthPayload
           createJob(input: JobInput): Job
           updateJob(id: ID!, input: UpdateJobInput): Job
           deleteJob(id: ID!): String
           applyForJob(input: ApplyForJobInput): Application
       }
   `;

   module.exports = typeDefs;





































































/** 
const { gql } = require('apollo-server-express');

   const typeDefs = gql`
       type User {
           id: ID!
           username: String!
           email: String!
           role: String!
           createdAt: String
       }

       type Job {
           id: ID!
           title: String!
           description: String!
           company: String!
           location: String!
           salary: Float
           jobType: String
           postedBy: User!
           createdAt: String
       }

       type Application {
           id: ID!
           job: Job!
           user: User!
           education: [Education]
           experience: [Experience]
           personalInfo: PersonalInfo
           status: String
           appliedAt: String
       }

       type Education {
           institution: String!
           degree: String!
           year: Int!
       }

       type Experience {
           company: String!
           role: String!
           years: Int!
       }

       type PersonalInfo {
           fullName: String!
           phone: String!
           address: String!
       }

       input RegisterInput {
           username: String!
           email: String!
           password: String!
           role: String!
       }

       input JobInput {
           title: String!
           description: String!
           company: String!
           location: String!
           salary: Float
           jobType: String
       }

       input JobFilter {
           keyword: String
           location: String
           company: String
           minSalary: Float
       }

       input EducationInput {
           institution: String!
           degree: String!
           year: Int!
       }

       input ExperienceInput {
           company: String!
           role: String!
           years: Int!
       }

       input PersonalInfoInput {
           fullName: String!
           phone: String!
           address: String!
       }

       input ApplyForJobInput {
           jobId: ID!
           education: [EducationInput]
           experience: [ExperienceInput]
           personalInfo: PersonalInfoInput
       }

       type AuthPayload {
           token: String!
           user: User!
       }

       type Query {
           jobs(filter: JobFilter, page: Int, limit: Int): [Job]
           recentSearches: [String]
       }

       type Mutation {
           register(input: RegisterInput): AuthPayload
           login(email: String!, password: String!): AuthPayload
           createJob(input: JobInput): Job
           updateJob(id: ID!, input: JobInput): Job
           deleteJob(id: ID!): String
           applyForJob(input: ApplyForJobInput): Application
       }
   `;

   module.exports = typeDefs;
   */