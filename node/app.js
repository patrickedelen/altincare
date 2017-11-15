import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} from 'graphql';

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            type: GraphQLString,
            resolve() {
                return 'world';
            }
        }
    })
});

let query = '{ hello }';

graphql(schema, query).then(result => {
    console.log(result);
})