import { translate, TranslationRule } from '../src';
import { graphql, GraphQLResolveInfo } from 'graphql';
import { TranslationContext } from '../src/TranslationContext';
import { AstNode } from '../src/ast';
import { makeExecutableSchema } from 'graphql-tools';

describe('translate function', () => {

    test('1984 test', () => {
        expect(2+2).toBe(4);
    });

    test('should return Hello World node', () => {
        let testnode: AstNode = {
            type: 'Hello world',
            resolve: (m) => m['root']
        }
        let helloworldRule: TranslationRule = (ctx: TranslationContext) => {
            return {
                OperationDefinition(node, key, parent, path, ancestors){
                    ctx.postAstNode({loc: 'root', node: testnode});
                }
            }
        };
        let testSDL = `type Query {
            hello: String
        }`;
        let resolvers = {
        Query: {
            hello: (object: any, args: { [argName: string]: any }, ctx: any, resolveInfo: GraphQLResolveInfo) => {
                try {
                    let node = translate(args, ctx, resolveInfo, [helloworldRule] );
                    console.log(node);
                } catch (error) {
                    console.log(error);
                }
                return 'Hello world!';
            }
        }};
        let testSchema = makeExecutableSchema({
            typeDefs: testSDL,
            resolvers
        });
        let root = {
            hello: (object: any, params: { [argName: string]: any }, ctx: any, resolveInfo: GraphQLResolveInfo) => {
                try {
                    let node = translate(params, ctx, resolveInfo, [helloworldRule] );
                    expect(node).toBe(testnode);
                    console.log(node);
                } catch (error) {
                    console.log(error);
                }
                return 'Hello world!';
            }
        }
        graphql(testSchema, '{ hello }', root).then( (response) => {
            expect(response).toBeDefined();
            console.log(response);
        });
    });
});