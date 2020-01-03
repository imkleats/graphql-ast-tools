# graphql-ast-tools
Rule-based translation of GraphQL Document ASTs to ASTs of other query languages for use in dynamic query planning.

### Concept

To understand the core processes of `graphql-ast-tools`, it can be helpful to have some background knowledge of the [Validation](https://graphql.org/graphql-js/validation/) stage of GraphQL, specifically `validate` and `visit` (or its extensions `visitWithTypeInfo` and `visitInParallel`). The validate function accepts an array of type `ValidationRule`. When initialized with a `ValidationContext`, these rules yield visitor functions, which are invoked upon query traversal and report validation errors that are collected within and returned by `validate` 

What if... instead of using `ValidationRule`(s) to return an array of error values, we use `TranslationRules` to return a map of generic AST nodes for any query language chosen by the user?

When traversing with `visit()`, each stop of a visitor function might not have _all_ the information it needs to complete a node, but it certainly already knows from the traversal context the _location_ where that information _will be_. This allows the use of an `AstMap` construct that lets any node to populate its elements based on the promise of another AST node existing after complete traversal. This significantly abstracts away the recursive processes invoked in many other query planners (which can frankly involve a good deal of manual book-keeping) and results in a paradigm that is almost entirely separable. In fact, a developer could even implement a multimodal AST to bridge multiple, nested dialects before the GraphQL query ever hits the resolvers (and further optimize with Dataloader). This multimodal AST generation also can be used to address the seamless integration of existing dialect-specific query planners in an enviroment that requires Apollo Federation specification compliance.

The output is itself an AST defined through the rule set supplied upon invocation. The implementation of the building of query strings from the resulting AST is a detail left to the user and is currently outside the scope of this project.

### HelloWorld AST

Placeholder for HelloAST demonstration.