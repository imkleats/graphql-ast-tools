import { TranslationContext } from '../src/TranslationContext';
import { TypeInfo, GraphQLResolveInfo, graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

describe('translation context class', () => {
    // TODO: define some tests for TranslationContext
    test('should work somehow', () => {
        
    });
    test('should return ', () => {
        let testSDL = `type Query {
            hello: String
        }`
        let resolvers = {
        Query: {
            hello: (object: any, args: { [argName: string]: any }, ctx: any, resolveInfo: GraphQLResolveInfo) => {
                // expect(resolveInfo).toBeDefined();
                console.log(resolveInfo);
                return 'Hello world!';
            }
        }};
        let testSchema = makeExecutableSchema({
            typeDefs: testSDL,
            resolvers
        });
        graphql(testSchema, 'query { hello }', null, {}).then( (response) => {
            expect(response).toBeDefined();
            console.log(response);
        });
    });
});