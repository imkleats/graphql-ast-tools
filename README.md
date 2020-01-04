# graphql-ast-tools
Rule-based translation of GraphQL Document ASTs to ASTs of other query languages for use in dynamic query planning.

### Concept

To understand the core processes of `graphql-ast-tools`, it can be helpful to have some background knowledge of the [Validation](https://graphql.org/graphql-js/validation/) stage of GraphQL, specifically `validate` and `visit` (or its extensions `visitWithTypeInfo` and `visitInParallel`). The validate function accepts an array of type `ValidationRule`. When initialized with a `ValidationContext`, these rules yield visitor functions, which are invoked upon query traversal and report validation errors that are collected within and returned by `validate` 

What if... instead of using `ValidationRule`(s) to return an array of error values, we use `TranslationRules` to return a map of generic AST nodes for any query language chosen by the user?

When traversing with `visit()`, each stop of a visitor function might not have _all_ the information it needs to complete a node, but it certainly already knows from the traversal context the _location_ where that information _will be_. This allows the use of an `AstMap` construct that lets any node to populate its elements based on the promise of another AST node existing after complete traversal. This significantly abstracts away the recursive processes invoked in many other query planners (which can frankly involve a good deal of manual book-keeping) and results in a paradigm that is almost entirely separable.

In fact, a developer could even implement a multimodal AST to bridge multiple, nested dialects before the GraphQL query ever hits the resolvers (and further optimize with Dataloader). This multimodal AST generation also can be used to address the seamless integration of existing dialect-specific query planners in an enviroment that requires Apollo Federation specification compliance.

The output is itself an AST defined through the rule set supplied upon invocation. The building of query strings from the resulting AST is an implementation detail left to the user and is currently outside the scope of this project.

### Why?

- Working with pure ASTs provides a type-safe way to modify/extend GraphQL query behavior at runtime.
- Flexibility to meet federation specifications while minimizing network/database calls.
- Reduces the need for implementing middleware solutions for GraphQL resolvers.
- Can fully replace most logic that is currently in resolver functions and directive behavior.

## HelloWorld AST

### Step 1: Define your AST
```ts
import { AstNode } from './src/ast';

interface HelloAST extends AstNode {
    name: string
}
```

### Step 2: Define your TranslationRule
```ts

const HelloNode: HelloAst = {
    type: 'Hello',
    name: 'world',
    resolve: (m) => m['root']
};

const HelloRule = (ctx: TranslationContext) => {
    return {
        OperationDefinition(node, key, parent, path, ancestors){
            ctx.postAstNode({loc: 'root', node: testnode});
        }
    }
}
```

### Step 3: Set up GraphQL to call `translate` from your resolver
```ts
let typeDefs = `type Query {
    hello: String
}`;

let resolvers = {
    Query: {
        hello: (
        object: any,
        args: { [argName: string]: any },
        ctx: any,
        resolveInfo: GraphQLResolveInfo
        ) => {
            try {
                let node = translate(args, ctx, resolveInfo, [HelloRule]) as HelloAST;
                console.log(node)
                return `${node.type}, ${node.name}!`;
            } catch (error) {
                return 'Oops!'
            }
        }
}};

let testSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});
```

### Step 4: Run your query
```ts
graphql(testSchema, '{ hello }', root).then( (response) => {
    console.log(response);
});

// Console:
// { type: 'Hello', name: 'world', resolve: [Function: resolve] } -- The AST Node
// { data: { hello: 'Hello, world!' } } -- The GraphQL Response
```