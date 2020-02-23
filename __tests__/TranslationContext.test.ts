import { TranslationContext } from '../src/TranslationContext';
import { TypeInfo, GraphQLResolveInfo, graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { AstNode, AstCoalescer } from '../src/ast';

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
                // Instantiate TranslationContext
                const typeInfo = new TypeInfo(resolveInfo.schema);
                const testContext = new TranslationContext(args, ctx, resolveInfo, typeInfo, (a: {loc: string, node: AstCoalescer}) => {});
                // Compare results of typeInfo methods to TranslationContext getters
                expect(testContext.getType()).toBe(typeInfo.getType());
                return 'Hello test!';
            }
        }};
        let testSchema = makeExecutableSchema({
            typeDefs: testSDL,
            resolvers
        });
        return graphql(testSchema, 'query { hello }', null, {}).then( (response) => {
            expect(response).toEqual(
                expect.objectContaining({
                    data: expect.objectContaining({
                        hello: expect.stringMatching('Hello test!')
                    })
                })
            );
            console.log(response);
        });
    });
});