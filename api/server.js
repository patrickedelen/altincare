require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloEngine } = require('apollo-engine');
const express = require('express');
const mongoose = require('mongoose');

const generate = require('./mocks/generate.js');

setup();

// setup the db based on the env variables
// check for environment and generate mock data accordingly
async function setup() {
    if (process.env.ALTIN_DB_URL === undefined) {
        throw new Error('Environment variables not correctly configured');
    }
    const mongoUrl = `${process.env.ALTIN_DB_URL}/${process.env.ALTIN_DB_NAME}`;
    await mongoose.connect(mongoUrl, { useNewUrlParser: true });
    console.log(`connected to database: ${process.env.ALTIN_DB_NAME}`);

    switch (process.env.ENVIRONMENT) {
    case 'dev':
        await generate.testData();
        break;
    case 'stage':
        console.log('in stage');
        break;
    case 'prod':
        console.log('in prod, no data to generate');
        break;
    default:
        console.log('env incorrect...');
        break;
    }
}


const typeDefs = gql`
type User {
    _id: Int!,
    name: String!,
    position: String!,  
    tasks: [Task], 
}

type Task {
    _id: Int!,
    title: String!,
    description: String,
    completed: Boolean!,
    assigned: User!,
}

type Query {
    users: [User],
}
`;

let users = [
    {_id: 1, name: 'Mary', position: 'base'},
    {_id: 2, name: 'Bill', position: 'elevated'},
];

let tasks = [
    {_id: 1, title: 'test1', completed: false, assignedId: 1},
    {_id: 2, title: 'test2222', completed: true, assignedId: 1},
];


const resolvers = {
    Query: {
        users: () => users
    }
};

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    cacheControl: true,
    engine: false,
});

server.applyMiddleware({ app });

const engine = new ApolloEngine({
    apiKey: process.env.ALTIN_APOLLO_ENGINE_KEY
});

engine.listen({
    port: 4000,
    expressApp: app
});

// app.listen(4000, () => console.log(`running server on http://localhost:4000/${server.graphqlPath}`));
