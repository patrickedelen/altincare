import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './src/schema';

const app = express();
const dev = process.env.NODE_ENV === 'development';

console.log('running...');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: dev
}));

app.use('/', (req, res) => {
    res.json('go to /graphql for queries');
});

const server = app.listen(3000, () => {
    const { port } = server.address();
    console.info(`server is available at http://localhost:${port} \n`);
});
